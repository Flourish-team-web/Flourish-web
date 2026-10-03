const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

interface ProductEnquiryPayload {
  productName: string;
  sku?: string | null;
  price?: number | null;
  productUrl?: string;
}

/**
 * Builds a direct WhatsApp enquiry click-to-chat URL.
 */
export function buildProductWhatsAppUrl(
  phoneNumber?: string,
  payload?: ProductEnquiryPayload
): string {
  const targetNumber = phoneNumber || DEFAULT_WHATSAPP_NUMBER;
  const cleanNumber = targetNumber.replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  
  if (!payload) {
    return buildBespokeWhatsAppUrl(cleanNumber);
  }

  const priceText = payload.price 
    ? `\nPrice: ₹${new Intl.NumberFormat('en-IN').format(payload.price)}` 
    : '';
  const skuText = payload.sku ? `\nSKU: ${payload.sku}` : '';
  const urlText = payload.productUrl ? `\nLink: ${payload.productUrl}` : '';

  const message = `Namaste Flourish Women's,\n\nI am interested in this exquisite piece:\n*${payload.productName}*${skuText}${priceText}${urlText}\n\nPlease let me know about availability, fabric details, and delivery options.\n\nThank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a bespoke bridal / styling assistance WhatsApp URL.
 */
export function buildBespokeWhatsAppUrl(
  phoneNumber?: string,
  customNote?: string
): string {
  const targetNumber = phoneNumber || DEFAULT_WHATSAPP_NUMBER;
  const cleanNumber = targetNumber.replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  const note = customNote || 'I would like to inquire about your curated saree collection and bespoke styling.';
  const message = `Namaste Flourish Women's,\n\n${note}\n\nCould you please connect me with a stylist?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
