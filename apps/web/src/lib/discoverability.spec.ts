import type { Metadata, MetadataRoute } from 'next';

import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';

import { buildRobotsMetadata, buildRobotsTxt, buildSitemapEntries } from './discoverability';
import { PRODUCTION_ORIGIN, isProductionHost } from './site';

const feature = await loadFeature('./discoverability.feature');

describeFeature(feature, ({ Scenario }) => {
  Scenario(
    'The live site publishes content signals and a sitemap',
    ({ Given, When, Then, And }) => {
      let indexable = false;
      let body = '';

      Given('the production host tonnta.surf', () => {
        indexable = isProductionHost('tonnta.surf');
        expect(indexable).toBe(true);
      });
      When('I build the robots.txt body', () => {
        body = buildRobotsTxt({ siteUrl: PRODUCTION_ORIGIN, indexable });
      });
      Then(
        'it carries the Content-Signal line allowing search and AI input but not training',
        () => {
          expect(body).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=no');
        }
      );
      And('it allows crawling and points at the sitemap', () => {
        expect(body).toContain('User-agent: *');
        expect(body).toContain('Allow: /');
        expect(body).toContain(`Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`);
      });
      And('it keeps crawlers out of the machine-facing paths', () => {
        expect(body).toContain('Disallow: /mcp');
        expect(body).toContain('Disallow: /api/');
        expect(body).not.toContain('\nDisallow: /\n');
      });
    }
  );

  Scenario('A preview deployment is closed to crawlers', ({ Given, When, Then, And }) => {
    let indexable = true;
    let body = '';

    Given('a Cloudflare Pages preview host', () => {
      indexable = isProductionHost('feat-agent-discoverability.tonnta.pages.dev');
      expect(indexable).toBe(false);
    });
    When('I build the robots.txt body', () => {
      body = buildRobotsTxt({ siteUrl: PRODUCTION_ORIGIN, indexable });
    });
    Then('it disallows everything', () => {
      expect(body).toContain('User-agent: *');
      expect(body).toContain('Disallow: /');
      expect(body).not.toContain('Allow: /');
    });
    And('it carries no Content-Signal line and no sitemap', () => {
      expect(body).not.toContain('Content-Signal');
      expect(body).not.toContain('Sitemap:');
    });
  });

  Scenario('Only the live domain counts as production', ({ Given, When, Then }) => {
    let hosts: string[] = [];
    let results: boolean[] = [];

    Given('the hosts tonnta.surf, www.tonnta.surf, tonnta.pages.dev and localhost:3000', () => {
      hosts = ['tonnta.surf', 'WWW.Tonnta.Surf', 'tonnta.pages.dev', 'localhost:3000'];
    });
    When('I check each for production', () => {
      results = hosts.map((host) => isProductionHost(host));
    });
    Then('only the two tonnta.surf hosts are production', () => {
      expect(results).toEqual([true, true, false, false]);
      expect(isProductionHost(null)).toBe(false);
      expect(isProductionHost(undefined)).toBe(false);
      expect(isProductionHost('')).toBe(false);
      expect(isProductionHost('evil-tonnta.surf')).toBe(false);
    });
  });

  Scenario('The sitemap lists every public route', ({ Given, When, Then, And }) => {
    let origin = '';
    let entries: MetadataRoute.Sitemap = [];
    const lastModified = new Date('2026-08-18T09:00:00.000Z');

    Given('the production origin', () => {
      origin = PRODUCTION_ORIGIN;
    });
    When('I build the sitemap entries', () => {
      entries = buildSitemapEntries(origin, lastModified);
    });
    Then('it lists the home page, the session log and the Pro page as absolute URLs', () => {
      expect(entries.map((entry) => entry.url)).toEqual([
        `${origin}/`,
        `${origin}/log`,
        `${origin}/pro`,
      ]);
      expect(entries.every((entry) => entry.lastModified === lastModified)).toBe(true);
    });
    And('the home page is the highest priority entry', () => {
      expect(entries[0]?.priority).toBe(1);
      expect(entries[0]?.changeFrequency).toBe('hourly');
    });
  });

  Scenario('Robots meta directives follow the host', ({ Given, When, Then, And }) => {
    let hosts: string[] = [];
    let directives: Metadata['robots'][] = [];

    Given('the production host and a preview host', () => {
      hosts = ['tonnta.surf', 'feat-agent-discoverability.tonnta.pages.dev'];
    });
    When('I build the robots meta for each', () => {
      directives = hosts.map((host) => buildRobotsMetadata(isProductionHost(host)));
    });
    Then('the production host is indexed and followed', () => {
      expect(directives[0]).toMatchObject({ index: true, follow: true });
    });
    And('the preview host is neither indexed nor followed', () => {
      expect(directives[1]).toEqual({ index: false, follow: false });
    });
  });
});
