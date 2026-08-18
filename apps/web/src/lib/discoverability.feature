Feature: Crawler-facing artefacts

  Scenario: The live site publishes content signals and a sitemap
    Given the production host tonnta.surf
    When I build the robots.txt body
    Then it carries the Content-Signal line allowing search and AI input but not training
    And it allows crawling and points at the sitemap
    And it keeps crawlers out of the machine-facing paths

  Scenario: A preview deployment is closed to crawlers
    Given a Cloudflare Pages preview host
    When I build the robots.txt body
    Then it disallows everything
    And it carries no Content-Signal line and no sitemap

  Scenario: Only the live domain counts as production
    Given the hosts tonnta.surf, www.tonnta.surf, tonnta.pages.dev and localhost:3000
    When I check each for production
    Then only the two tonnta.surf hosts are production

  Scenario: The sitemap lists every public route
    Given the production origin
    When I build the sitemap entries
    Then it lists the home page, the session log and the Pro page as absolute URLs
    And the home page is the highest priority entry

  Scenario: Robots meta directives follow the host
    Given the production host and a preview host
    When I build the robots meta for each
    Then the production host is indexed and followed
    And the preview host is neither indexed nor followed
