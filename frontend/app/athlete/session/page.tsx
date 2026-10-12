'use client';

import React from 'react';
import SessionContainer from '@/features/member/sessions/container/SessionContainer';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <SessionContainer />;
}