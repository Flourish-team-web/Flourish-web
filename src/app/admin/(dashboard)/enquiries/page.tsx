'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { EnquiryStatus } from '@/types/database.types';
import { formatCurrencyINR, formatDate } from '@/lib/utils/formatters';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Trash2,
  Loader2,
  Search,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface EnquiryWithItems {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_location: string | null;
  message: string | null;
  status: EnquiryStatus;
  source: string | null;
  created_at: string;
  items?: Array<{
    id: string;
    product_name: string;
    product_sku: string | null;
    product_price: number | null;
    quantity: number;
  }>;
}

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: 'New Lead',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  contacted: {
    label: 'Contacted',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-400',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-400',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#64748B]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
  },
};

const STATUS_FILTER_TABS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = React.useState<EnquiryWithItems[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchEnquiries = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select(`*, items:enquiry_items(*)`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEnquiries(data as unknown as EnquiryWithItems[]);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: EnquiryStatus) => {
    const supabase = createClient();
    await (supabase.from('enquiries') as any).update({ status: newStatus }).eq('id', id);
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (!error) setEnquiries(enquiries.filter((e) => e.id !== id));
  };

  const openWhatsApp = (phone: string, name: string, product?: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = `Namaste ${name}, this is the concierge team from Flourish Woman following up on your saree enquiry${product ? ' for ' + product : ''}. How may we assist you?`;
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const filtered = enquiries.filter((e) => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      e.customer_name.toLowerCase().includes(q) ||
      e.customer_phone.includes(q) ||
      (e.customer_location && e.customer_location.toLowerCase().includes(q)) ||
      (e.items && e.items.some((i) => i.product_name.toLowerCase().includes(q)));
    return matchStatus && matchSearch;
  });

  // Count by status
  const counts = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    acc['all'] = (acc['all'] || 0) + 1;
    return acc;
  }, { all: 0 });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-500 font-semibold">
              CRM — Customer Leads
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-medium">Enquiries</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Track customer orders, bridal leads, and manage fulfillment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold block">Total Leads</span>
            <span className="font-serif text-2xl text-[#0F172A] font-semibold">{enquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Search + Status Tabs */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by name, phone, city, or saree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Status Tab Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          {STATUS_FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border',
                statusFilter === tab.value
                  ? 'bg-[#071324] text-[#38BDF8] border-[#38BDF8]/40'
                  : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
              )}
            >
              {tab.label}
              {counts[tab.value] > 0 && (
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                    statusFilter === tab.value
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                      : 'bg-[#E2E8F0] text-[#64748B]'
                  )}
                >
                  {counts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiry Cards */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl text-center py-20 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-medium">Loading enquiries...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((enquiry) => {
            const firstItem = enquiry.items?.[0];
            const badge = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.new;

            return (
              <div
                key={enquiry.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Left: Customer details */}
                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Status + time */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border rounded-xl ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(enquiry.created_at)}
                      </span>
                      {enquiry.source && (
                        <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-lg font-mono">
                          via {enquiry.source}
                        </span>
                      )}
                    </div>

                    {/* Customer name + contact */}
                    <div>
                      <h3 className="font-serif text-lg text-[#0F172A] font-medium">
                        {enquiry.customer_name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-xs text-[#475569] mt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          {enquiry.customer_phone}
                        </span>
                        {enquiry.customer_email && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#0284C7]" />
                            {enquiry.customer_email}
                          </span>
                        )}
                        {enquiry.customer_location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {enquiry.customer_location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product item */}
                    {firstItem && (
                      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                            <Package className="w-3.5 h-3.5 text-[#0284C7]" />
                          </div>
                          <div>
                            <span className="font-medium text-[#0F172A]">{firstItem.product_name}</span>
                            {firstItem.product_sku && (
                              <span className="text-[10px] text-[#94A3B8] ml-2 font-mono">
                                #{firstItem.product_sku}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-[#0F172A]">
                            {formatCurrencyINR(firstItem.product_price)}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] block">Qty: {firstItem.quantity}</span>
                        </div>
                      </div>
                    )}

                    {/* Customer note */}
                    {enquiry.message && (
                      <div className="text-xs text-[#475569] bg-[#FAFBFC] border border-[#E2E8F0] rounded-xl p-3 border-l-4 border-l-[#0284C7]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                          Customer Note
                        </p>
                        <p className="whitespace-pre-line font-light">{enquiry.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Status change + Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0 border-t lg:border-t-0 lg:border-l lg:border-[#F1F5F9] pt-3 lg:pt-0 lg:pl-5">
                    <div className="space-y-1.5 w-full lg:w-44">
                      <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold block">
                        Update Status
                      </label>
                      <select
                        value={enquiry.status}
                        onChange={(e) => updateStatus(enquiry.id, e.target.value as EnquiryStatus)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:border-[#0284C7] focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Order Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => openWhatsApp(enquiry.customer_phone, enquiry.customer_name, firstItem?.product_name)}
                        className="flex-1 lg:flex-initial flex items-center gap-1.5 text-[11px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </Button>

                      <button
                        onClick={() => handleDelete(enquiry.id, enquiry.customer_name)}
                        className="p-2 rounded-xl text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl text-center py-20">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="font-serif text-lg text-[#0F172A] mb-1">No Enquiries Found</p>
          <p className="text-xs text-[#64748B] font-light">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search or filter.'
              : 'Customer WhatsApp leads will appear here in real-time.'}
          </p>
        </div>
      )}
    </div>
  );
}
