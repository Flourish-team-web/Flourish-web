import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerLocation,
      customerAddress,
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

    const fullAddress = customerAddress || customerLocation || '';

    const supabase = await createServerSupabaseClient();

    // 1. Fetch live WhatsApp number from site settings or env
    let targetWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
    try {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('whatsapp_number')
        .eq('id', 'global')
        .single();

      const siteSettings = settingsData as { whatsapp_number?: string } | null;
      if (siteSettings?.whatsapp_number) {
        targetWhatsAppNumber = siteSettings.whatsapp_number;
      }
    } catch (e) {
      // fallback to env or default
    }

    // 2. Insert enquiry into Supabase
    const { data: enquiryData, error: enquiryError } = await (supabase
      .from('enquiries') as any)
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        customer_location: fullAddress || null,
        message: message || null,
        source: source || 'product_whatsapp_order',
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

    // 4. Build professional WhatsApp order message
    let whatsappUrl: string;
    const cleanNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '') || '919876543210';

    if (item && item.productName) {
      const priceFormatted = item.price
        ? `₹${new Intl.NumberFormat('en-IN').format(item.price)}`
        : 'Price on Request';
      const skuLine = item.sku ? `• *Product Code / SKU:* ${item.sku}\n` : '';
      const qtyLine = item.quantity && item.quantity > 1 ? `• *Quantity:* ${item.quantity}\n` : '• *Quantity:* 1\n';
      const urlLine = item.productUrl ? `• *Link:* ${item.productUrl}\n` : '';
      const addressLine = fullAddress ? `• *Delivery Address:*\n${fullAddress}\n` : '';
      const noteLine = message ? `• *Customization Note:* ${message}\n` : '';

      const waMessage = `🛍️ *NEW SAREE ORDER — FLOURISH WOMEN'S*

*Product Details:*
• *Saree:* ${item.productName}
${skuLine}• *Price:* ${priceFormatted}
${qtyLine}${urlLine}
*Customer & Delivery Information:*
• *Name:* ${customerName}
• *WhatsApp / Phone:* ${customerPhone}
${addressLine}${noteLine}
Please confirm availability, dispatch timeline, and payment options. Thank you!`;

      whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`;
    } else {
      const customNote = `Order Inquiry from ${customerName} (${customerPhone}${fullAddress ? '\nAddress: ' + fullAddress : ''}):\n${message || 'I would like to place an order for your curated saree collection.'}`;
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
