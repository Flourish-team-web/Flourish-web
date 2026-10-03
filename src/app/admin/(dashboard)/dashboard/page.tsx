import * as React from 'react';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  Package,
  Layers,
  FolderKanban,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Image as ImageIcon,
  Film,
  TrendingUp,
  Activity,
  Star,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Flourish Woman',
};

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: collectionsCount },
    { count: enquiriesCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }),
  ]);

  const statCards = [
    {
      title: 'Products',
      subtitle: 'In catalog',
      count: productsCount ?? 0,
      icon: Package,
      href: '/admin/products',
      label: 'Manage',
      gradient: 'from-blue-500 to-sky-400',
      shadow: 'shadow-blue-500/20',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
    {
      title: 'Categories',
      subtitle: 'Weave types',
      count: categoriesCount ?? 0,
      icon: Layers,
      href: '/admin/categories',
      label: 'Manage',
      gradient: 'from-violet-500 to-purple-400',
      shadow: 'shadow-violet-500/20',
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
    },
    {
      title: 'Collections',
      subtitle: 'Curated edits',
      count: collectionsCount ?? 0,
      icon: FolderKanban,
      href: '/admin/collections',
      label: 'Manage',
      gradient: 'from-amber-500 to-orange-400',
      shadow: 'shadow-amber-500/20',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
    },
    {
      title: 'Enquiries',
      subtitle: 'Customer leads',
      count: enquiriesCount ?? 0,
      icon: MessageSquare,
      href: '/admin/enquiries',
      label: 'Review',
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
    },
  ];

  const quickLinks = [
    {
      title: 'Add Saree',
      desc: 'Upload gallery & craft specs',
      href: '/admin/products/new',
      icon: Package,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 hover:border-sky-400/40',
    },
    {
      title: 'Enquiries',
      desc: 'View WhatsApp leads',
      href: '/admin/enquiries',
      icon: MessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-400/40',
    },
    {
      title: 'Hero Banners',
      desc: 'Update homepage slider',
      href: '/admin/banners',
      icon: ImageIcon,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20 hover:border-violet-400/40',
    },
    {
      title: 'Reels',
      desc: 'Video drapes & lookbooks',
      href: '/admin/reels',
      icon: Film,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-400/40',
    },
    {
      title: 'Testimonials',
      desc: 'Customer reviews & stories',
      href: '/admin/testimonials',
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-400/40',
    },
    {
      title: 'Editorial',
      desc: 'Brand story & spotlight',
      href: '/admin/editorial',
      icon: BookOpen,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20 hover:border-pink-400/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">
              Boutique Overview
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] tracking-tight font-medium">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#64748B] font-sans mt-1 max-w-md">
            Manage your boutique inventory, photography, curated collections, and customer concierge leads from one unified panel.
          </p>
        </div>

        <Link href="/admin/products/new" className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm shadow-[#0284C7]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Saree</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#CBD5E1] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{card.subtitle}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md ${card.shadow} group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-semibold tracking-tight">
                  {card.count}
                </span>
                <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                  <Link
                    href={card.href}
                    className="flex items-center justify-between text-xs text-[#0284C7] hover:text-[#0369A1] font-semibold transition-colors group/link"
                  >
                    <span>{card.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-[#0284C7]" />
          <h2 className="font-serif text-lg text-[#0F172A] font-medium">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`p-4 border rounded-xl transition-all duration-200 block group ${link.bg}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${link.color} bg-white/10 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className={`font-semibold text-xs text-[#0F172A] group-hover:${link.color} transition-colors`}>
                  {link.title}
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5 font-light">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
