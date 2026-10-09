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
  Clock,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { formatCurrencyINR, formatDate } from '@/lib/utils/formatters';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { EnquiryStatus } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Flourish Woman',
};

const STATUS_BADGE: Record<
  EnquiryStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: { label: 'New Lead', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  contacted: { label: 'Contacted', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400' },
  confirmed: { label: 'Confirmed', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  cancelled: { label: 'Cancelled', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: collectionsCount },
    { count: enquiriesCount },
    { data: recentEnquiriesData },
    { data: recentProductsData },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }),
    supabase
      .from('enquiries')
      .select('*, items:enquiry_items(*)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select('*, images:product_images(*), category:categories(*)')
      .order('created_at', { ascending: false })
      .limit(4),
  ]);

  interface DashboardEnquiry {
    id: string;
    customer_name: string;
    customer_phone: string;
    created_at: string;
    status: EnquiryStatus;
    items?: Array<{ product_name: string }>;
  }

  const recentEnquiries = (recentEnquiriesData as unknown as DashboardEnquiry[]) || [];
  const recentProducts = (recentProductsData as unknown as Array<{
    id: string;
    name: string;
    price: number;
    images?: Array<{ image_url: string }>;
    category?: { name: string } | null;
  }>) || [];

  const statCards = [
    {
      title: 'Products',
      subtitle: 'In catalog',
      count: productsCount ?? 0,
      icon: Package,
      href: '/admin/products',
      label: 'Manage Catalog',
      gradient: 'from-blue-500 to-sky-400',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'Categories',
      subtitle: 'Weave types',
      count: categoriesCount ?? 0,
      icon: Layers,
      href: '/admin/categories',
      label: 'Manage Weaves',
      gradient: 'from-violet-500 to-purple-400',
      shadow: 'shadow-violet-500/20',
    },
    {
      title: 'Collections',
      subtitle: 'Curated edits',
      count: collectionsCount ?? 0,
      icon: FolderKanban,
      href: '/admin/collections',
      label: 'Manage Curations',
      gradient: 'from-amber-500 to-orange-400',
      shadow: 'shadow-amber-500/20',
    },
    {
      title: 'Enquiries',
      subtitle: 'Customer leads',
      count: enquiriesCount ?? 0,
      icon: MessageSquare,
      href: '/admin/enquiries',
      label: 'Review Leads',
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/20',
    },
  ];

  const quickLinks = [
    {
      title: 'Add Saree',
      desc: 'Upload gallery & specs',
      href: '/admin/products/new',
      icon: Package,
      color: 'text-sky-500',
      bg: 'bg-sky-50 hover:bg-sky-100/70 border-sky-200',
    },
    {
      title: 'Enquiries CRM',
      desc: 'View customer requests',
      href: '/admin/enquiries',
      icon: MessageSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200',
    },
    {
      title: 'Hero Banners',
      desc: 'Homepage visual slider',
      href: '/admin/banners',
      icon: ImageIcon,
      color: 'text-violet-500',
      bg: 'bg-violet-50 hover:bg-violet-100/70 border-violet-200',
    },
    {
      title: 'Flourish Reels',
      desc: 'Video lookbooks',
      href: '/admin/reels',
      icon: Film,
      color: 'text-rose-500',
      bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200',
    },
    {
      title: 'Testimonials',
      desc: 'Client reviews & stories',
      href: '/admin/testimonials',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200',
    },
    {
      title: 'Flourish Edit',
      desc: 'Editorial articles',
      href: '/admin/editorial',
      icon: BookOpen,
      color: 'text-pink-500',
      bg: 'bg-pink-50 hover:bg-pink-100/70 border-pink-200',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#0284C7]" />
            <span className="text-[10px] uppercase tracking-widest text-[#0284C7] font-bold">
              Boutique Overview
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] tracking-tight font-medium">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#64748B] font-sans mt-0.5 max-w-lg">
            Manage your boutique inventory, photography, curated collections, and customer leads from one unified panel.
          </p>
        </div>

        <Link href="/admin/products/new" className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm shadow-[#0284C7]/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Saree</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#CBD5E1] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{card.subtitle}</p>
                </div>
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md ${card.shadow} group-hover:scale-110 transition-transform duration-200 shrink-0`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-semibold tracking-tight">
                  {card.count}
                </span>
                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#F1F5F9]">
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
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${link.color} bg-white shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-[#0F172A] transition-colors">
                  {link.title}
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5 font-light">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Recent Sarees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Recent Enquiries */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <h2 className="font-serif text-lg text-[#0F172A] font-medium">Recent Enquiries</h2>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs text-[#0284C7] hover:text-[#0369A1] font-semibold flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {recentEnquiries.map((enq) => {
                  const badge = STATUS_BADGE[enq.status] || STATUS_BADGE.new;
                  const item = enq.items?.[0];
                  return (
                    <div
                      key={enq.id}
                      className="p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs text-[#0F172A] truncate">
                            {enq.customer_name}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full ${badge.bg} ${badge.text}`}>
                            <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                          <span>{enq.customer_phone}</span>
                          {item && (
                            <span className="truncate max-w-[140px] text-[#0284C7] font-medium">
                              • {item.product_name}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-[#94A3B8] shrink-0">
                        {formatDate(enq.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[#94A3B8]">
                No customer enquiries recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F1F5F9]">
            <Link
              href="/admin/enquiries"
              className="w-full py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Enquiries CRM
            </Link>
          </div>
        </div>

        {/* 2. Recently Added Products */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0284C7]" />
                <h2 className="font-serif text-lg text-[#0F172A] font-medium">Recent Catalog Additions</h2>
              </div>
              <Link
                href="/admin/products"
                className="text-xs text-[#0284C7] hover:text-[#0369A1] font-semibold flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((prod) => {
                  const primaryImg = prod.images?.[0]?.image_url || '/images/placeholder-saree.jpg';
                  return (
                    <div
                      key={prod.id}
                      className="p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-13 rounded-lg overflow-hidden bg-white border border-[#E2E8F0] shrink-0">
                          <Image
                            src={primaryImg}
                            alt={prod.name}
                            fill
                            sizes="40px"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-[#0F172A] truncate">
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                            <span className="font-semibold text-[#0F172A]">
                              {formatCurrencyINR(prod.price)}
                            </span>
                            {prod.category?.name && (
                              <span>• {prod.category.name}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="px-2.5 py-1 text-[11px] font-medium text-[#0284C7] bg-[#E0F2FE] hover:bg-[#BAE6FD] rounded-lg transition-colors shrink-0"
                      >
                        Edit
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[#94A3B8]">
                No sarees added to catalog yet.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F1F5F9]">
            <Link
              href="/admin/products/new"
              className="w-full py-2 bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Saree to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
