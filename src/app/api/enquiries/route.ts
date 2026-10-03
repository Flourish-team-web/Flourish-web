import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

// Input sanitization helpers
function sanitizeText(input: unknown, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Protection (Max 10 submissions per minute per IP)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`enquiry_${clientIp}`, 10, 60 * 1000);

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetInMs / 1000)),
        },
      }
    );
  }

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request payload format.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    // 2. Extract & Sanitize Input Fields
    const customerName = sanitizeText(body.customerName, 100);
    const rawPhone = sanitizeText(body.customerPhone, 30);
    const customerEmail = sanitizeText(body.customerEmail, 150);
    const customerLocation = sanitizeText(body.customerLocation, 150);
    const customerAddress = sanitizeText(body.customerAddress, 400);
    const message = sanitizeText(body.message, 1000);
    const source = sanitizeText(body.source || 'product_whatsapp_order', 50);

    // 3. Strict Server-Side Field Validation
    if (!customerName || customerName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid customer name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!rawPhone || !isValidPhone(rawPhone)) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number with 7 to 15 digits.' },
        { status: 400 }
      );
    }

    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address or leave it empty.' },
        { status: 400 }
      );
    }

    const fullAddress = customerAddress || customerLocation || '';

    // 4. Validate & Verify Item Details (if provided)
    let validatedItem: {
      productId: string | null;
      productName: string;
      sku: string | null;
      price: number | null;
      quantity: number;
      productUrl: string | null;
    } | null = null;

    if (body.item && typeof body.item === 'object') {
      const rawItem = body.item;
      const itemName = sanitizeText(rawItem.productName, 150);

      if (itemName) {
        let itemQuantity = 1;
        if (typeof rawItem.quantity === 'number' && Number.isFinite(rawItem.quantity)) {
          itemQuantity = Math.max(1, Math.min(50, Math.floor(rawItem.quantity)));
        }

        let itemPrice: number | null = null;
        if (typeof rawItem.price === 'number' && Number.isFinite(rawItem.price) && rawItem.price >= 0) {
          itemPrice = rawItem.price;
        }

        const rawProductId = sanitizeText(rawItem.productId, 50) || null;

        // If productId is a UUID, cross-verify price and name from database
        if (rawProductId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawProductId)) {
          try {
            const serverClient = await createServerSupabaseClient();
            const { data: dbProduct } = await serverClient
              .from('products')
              .select('id, name, price, sku')
              .eq('id', rawProductId)
              .maybeSingle();

            if (dbProduct) {
              const productRec = dbProduct as { id: string; name: string; price: number; sku?: string };
              itemPrice = productRec.price;
            }
          } catch {
            // fallback to client-sent price if DB read is unreachable
          }
        }

        validatedItem = {
          productId: rawProductId,
          productName: itemName,
          sku: sanitizeText(rawItem.sku, 50) || null,
          price: itemPrice,
          quantity: itemQuantity,
          productUrl: typeof rawItem.productUrl === 'string' ? sanitizeText(rawItem.productUrl, 300) : null,
        };
      }
    }

    // 5. Resolve Trusted WhatsApp Business Number
    let targetWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
    try {
      const serverClient = await createServerSupabaseClient();
      const { data: settingsData } = await serverClient
        .from('site_settings')
        .select('whatsapp_number')
        .eq('id', 'global')
        .maybeSingle();

      const siteSettings = settingsData as { whatsapp_number?: string } | null;
      if (siteSettings?.whatsapp_number) {
        targetWhatsAppNumber = siteSettings.whatsapp_number;
      }
    } catch {
      // fallback to env variable or default
    }

    const cleanTargetNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '') || '919876543210';

    // 6. Build Professional WhatsApp Order Message
    let whatsappUrl: string;

    if (validatedItem && validatedItem.productName) {
      const priceFormatted = validatedItem.price !== null
        ? `₹${new Intl.NumberFormat('en-IN').format(validatedItem.price)}`
        : 'Price on Request';
      const skuLine = validatedItem.sku ? `• *Product Code / SKU:* ${validatedItem.sku}\n` : '';
      const qtyLine = validatedItem.quantity > 1 ? `• *Quantity:* ${validatedItem.quantity}\n` : '• *Quantity:* 1\n';
      const urlLine = validatedItem.productUrl ? `• *Link:* ${validatedItem.productUrl}\n` : '';
      const addressLine = fullAddress ? `• *Delivery Address:*\n${fullAddress}\n` : '';
      const noteLine = message ? `• *Customization Note:* ${message}\n` : '';

      const waMessage = `🛍️ *NEW SAREE ORDER — FLOURISH WOMEN'S*

*Product Details:*
• *Saree:* ${validatedItem.productName}
${skuLine}• *Price:* ${priceFormatted}
${qtyLine}${urlLine}
*Customer & Delivery Information:*
• *Name:* ${customerName}
• *WhatsApp / Phone:* ${rawPhone}
${addressLine}${noteLine}
Please confirm availability, dispatch timeline, and payment options. Thank you!`;

      whatsappUrl = `https://wa.me/${cleanTargetNumber}?text=${encodeURIComponent(waMessage)}`;
    } else {
      const customNote = `Order Inquiry from ${customerName} (${rawPhone}${fullAddress ? '\nAddress: ' + fullAddress : ''}):\n${message || 'I would like to place an order for your curated saree collection.'}`;
      whatsappUrl = buildBespokeWhatsAppUrl(cleanTargetNumber, customNote);
    }

    // 7. Securely Insert Enquiry into Supabase (Admin Privileged Client)
    let recordedEnquiryId: string | null = null;
    try {
      const adminClient = createAdminSupabaseClient();
      const { data: enquiryData, error: enquiryError } = await (adminClient
        .from('enquiries') as any)
        .insert({
          customer_name: customerName,
          customer_phone: rawPhone,
          customer_email: customerEmail || null,
          customer_location: fullAddress || null,
          message: message || null,
          source: source,
          status: 'new',
        })
        .select('id')
        .maybeSingle();

      if (!enquiryError && enquiryData) {
        recordedEnquiryId = enquiryData.id;

        // Insert enquiry item record
        if (validatedItem && validatedItem.productName && recordedEnquiryId) {
          await (adminClient.from('enquiry_items') as any).insert({
            enquiry_id: recordedEnquiryId,
            product_id: validatedItem.productId || null,
            product_name: validatedItem.productName,
            product_sku: validatedItem.sku || null,
            product_price: validatedItem.price,
            quantity: validatedItem.quantity,
          });
        }
      } else if (enquiryError) {
        console.warn('Enquiry database record note:', enquiryError.message);
      }
    } catch (dbErr: any) {
      console.warn('Could not record enquiry in database, continuing with WhatsApp dispatch:', dbErr?.message || dbErr);
    }

    // 8. Always Return Safe Response
    return NextResponse.json({
      success: true,
      enquiryId: recordedEnquiryId,
      whatsappUrl,
    });
  } catch (err: any) {
    console.error('Enquiry handler unexpected error:', err?.message || err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please connect directly via WhatsApp.' },
      { status: 500 }
    );
  }
}
