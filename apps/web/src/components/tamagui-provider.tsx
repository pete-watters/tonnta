'use client';

import type { ReactNode } from 'react';

import { useServerInsertedHTML } from 'next/navigation';

import { TamaguiProvider, Theme } from 'tamagui';

import { config } from '@tonnta/ui/tamagui.config';

interface TamaguiClientProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app in Tamagui's provider and injects the SSR CSS into <head>
 * during the server pass, so the first paint is fully themed. v1 ships the
 * dark `dawn` theme only — people check the surf at 6am; the `day` theme
 * exists in tokens and arrives with the settings screen.
 */
export function TamaguiClientProvider({ children }: TamaguiClientProviderProps) {
  useServerInsertedHTML(() => (
    <style
      key="tamagui-ssr"
      dangerouslySetInnerHTML={{
        __html: config.getCSS({ exclude: 'design-system' }),
      }}
    />
  ));

  return (
    <TamaguiProvider config={config} defaultTheme="dawn" disableInjectCSS>
      <Theme name="dawn">{children}</Theme>
    </TamaguiProvider>
  );
}
