'use client';

import { useEffect } from 'react';
import { seedEventsIfEmpty } from '@/lib/db';

export default function ClientSeeder() {
  useEffect(() => {
    // Auto-seed database for the user on first load
    seedEventsIfEmpty().catch(console.error);
  }, []);

  return null;
}
