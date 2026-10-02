import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { buildProductWhatsAppUrl, buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerLocation,
      message,
      source,
      item,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // 1. Fetch live WhatsApp number from site settings (fallback if not customized)
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('whatsapp_number')
      .eq('id', 'global')
      .single();

    const siteSettings = settingsData as { whatsapp_number?: string } | null;
    const targetWhatsAppNumber = siteSettings?.whatsapp_number || '919876543210';

    // 2. Insert enquiry into Supabase
    const { data: enquiryData, error: enquiryError } = await (supabase
      .from('enquiries') as any)
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        customer_location: customerLocation || null,
        message: message || null,
        source: source || 'storefront_modal',
        status: 'new',
      })
      .select('id')
      .single();

    const enquiry = enquiryData as { id: string } | null;

    if (enquiryError || !enquiry) {
      console.error('Failed to create enquiry record:', enquiryError);
      return NextResponse.json({ error: 'Failed to record enquiry' }, { status: 500 });
    }

    // 3. Insert enquiry item if provided
    if (item && item.productName) {
      await (supabase.from('enquiry_items') as any).insert({
        enquiry_id: enquiry.id,
        product_id: item.productId || null,
        product_name: item.productName,
        product_sku: item.sku || null,
        product_price: item.price || null,
        quantity: item.quantity || 1,
      });
    }

    // 4. Build professional WhatsApp message
    let whatsappUrl: string;

    if (item && item.productName) {
      const cleanNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '');
      const priceText = item.price
        ? `\nPrice: ₹${new Intl.NumberFormat('en-IN').format(item.price)}`
        : '';
      const skuText = item.sku ? `\nSKU: ${item.sku}` : '';
      const qtyText = item.quantity && item.quantity > 1 ? `\nQuantity: ${item.quantity}` : '';
      const locText = customerLocation ? `\nLocation/City: ${customerLocation}` : '';
      const customMsgText = message ? `\nCustomer Note: ${message}` : '';

      const waMessage = `Namaste Flourish Woman,\n\nI would like to enquire about this exquisite saree:\n*${item.productName}*${skuText}${priceText}${qtyText}\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${customerPhone}${locText}${customMsgText}\n\nPlease confirm availability, weave details, and delivery schedule.\n\nThank you!`;

      whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`;
    } else {
      const customNote = `Inquiry from ${customerName} (${customerPhone}${customerLocation ? ', ' + customerLocation : ''}): ${message || 'I would like to inquire about your curated saree collection.'}`;
      whatsappUrl = buildBespokeWhatsAppUrl(targetWhatsAppNumber, customNote);
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      whatsappUrl,
    });
  } catch (err) {
    console.error('Enquiry handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
