import type { Metadata } from 'next';

import { ProClient } from './pro-client';

export const metadata: Metadata = {
  title: 'Tonnta Pro',
  description:
    'The daily check stays free forever. Pro is the alerts — €14.90 a year, and a founder lifetime deal for the first hundred.',
};

export default function ProPage() {
  return <ProClient />;
}
