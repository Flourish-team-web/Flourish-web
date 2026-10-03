import * as React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AdminLayoutClient userEmail={user?.email || 'admin@flourishwoman.com'}>
      {children}
    </AdminLayoutClient>
  );
}
