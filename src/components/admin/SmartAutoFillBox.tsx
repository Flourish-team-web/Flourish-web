'use client';

import * as React from 'react';
import { Copy, Check, Download, Zap } from 'lucide-react';
import { Category } from '@/types/store.types';
import { slugify } from '@/lib/utils/formatters';

export interface AutoFillPayload {
  name?: string;
  slug?: string;
  sku?: string;
  categoryId?: string;
  price?: string;
  comparePrice?: string;
  fabric?: string;
  sareeType?: string;
  color?: string;
  occasion?: string;
  dimensions?: string;
  blouseDetails?: string;
  washCare?: string;
  shortDescription?: string;
  description?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'made_to_order';
  isPublished?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  images?: string[];
}

interface SmartAutoFillBoxProps {
  categories: Category[];
  onAutoFill: (data: AutoFillPayload) => void;
}

export const BLANK_TEMPLATE = `PRODUCT NAME:


PRODUCT SLUG:


SKU:


CATEGORY:


SELLING PRICE:


COMPARE PRICE:


AVAILABILITY:
in_stock

FABRIC:


SAREE TYPE:


COLOR:


OCCASION:


DIMENSIONS:
5.5 Meters Saree Length

BLOUSE DETAILS:
0.8 Meter Running Blouse Piece Included

WASH CARE:
Dry Clean Only. Store in Muslin Wrap

SHORT DESCRIPTION:


PRODUCT DESCRIPTION:


PUBLISHED:
yes

NEW ARRIVAL:
yes

BESTSELLER:
no

FEATURED:
no
`;

export const SAMPLE_TEMPLATE = `PRODUCT NAME:
Flourish Royal Kanchipuram Pure Silk Saree

PRODUCT SLUG:
flourish-royal-kanchipuram-pure-silk-saree

SKU:
FW-KNC-001

CATEGORY:
Kanchipuram Sarees

SELLING PRICE:
18500

COMPARE PRICE:
24000

AVAILABILITY:
in_stock

FABRIC:
Pure Mulberry Silk (Silk Mark Certified)

SAREE TYPE:
Traditional Korvai Handloom Zari

COLOR:
Royal Blue & Pure Gold Zari

OCCASION:
Bridal, Wedding & Grand Celebrations

DIMENSIONS:
5.5 Meters Saree Length

BLOUSE DETAILS:
0.8 Meter Running Blouse Piece Included

WASH CARE:
Dry Clean Only. Store in breathable muslin wrap.

SHORT DESCRIPTION:
Exquisite handcrafted pure Kanchipuram silk saree with rich gold zari pallu and traditional temple motifs.

PRODUCT DESCRIPTION:
Handcrafted by master weavers in Kanchipuram for Flourish Women's, this authentic bridal silk saree showcases pure zari craftsmanship, opulent temple borders, and heirloom luxury.

PUBLISHED:
yes

NEW ARRIVAL:
yes

BESTSELLER:
no

FEATURED:
yes
`;

interface KeyMatcher {
  field: keyof AutoFillPayload | 'categoryName';
  patterns: RegExp[];
}

const KEY_MATCHERS: KeyMatcher[] = [
  { field: 'name', patterns: [/^PRODUCT\s*NAME:?/i, /^NAME:?/i, /^SAREE\s*NAME:?/i, /^TITLE:?/i] },
  { field: 'slug', patterns: [/^PRODUCT\s*SLUG:?/i, /^SLUG:?/i, /^URL\s*SLUG:?/i] },
  { field: 'sku', patterns: [/^SKU:?/i, /^PRODUCT\s*CODE:?/i, /^CODE:?/i, /^ITEM\s*CODE:?/i] },
  { field: 'categoryName', patterns: [/^CATEGORY:?/i, /^WEAVE\s*CATEGORY:?/i, /^CATEGORY\s*NAME:?/i] },
  { field: 'price', patterns: [/^SELLING\s*PRICE:?/i, /^PRICE:?/i, /^SALE\s*PRICE:?/i, /^OFFER\s*PRICE:?/i] },
  { field: 'comparePrice', patterns: [/^COMPARE\s*PRICE:?/i, /^MRP:?/i, /^ORIGINAL\s*PRICE:?/i, /^REGULAR\s*PRICE:?/i] },
  { field: 'availability', patterns: [/^AVAILABILITY:?/i, /^AVAILABILITY\s*STATUS:?/i, /^STOCK:?/i] },
  { field: 'fabric', patterns: [/^FABRIC:?/i, /^FABRIC\s*\/\s*FIBER:?/i, /^MATERIAL:?/i] },
  { field: 'sareeType', patterns: [/^SAREE\s*TYPE:?/i, /^WEAVE\s*TECHNIQUE:?/i, /^TYPE:?/i, /^WEAVE:?/i] },
  { field: 'color', patterns: [/^COLOR:?/i, /^COLOUR:?/i, /^COLOR\s*PALETTE:?/i, /^SHADE:?/i] },
  { field: 'occasion', patterns: [/^OCCASION:?/i, /^EVENT:?/i, /^SUITABLE\s*FOR:?/i] },
  { field: 'dimensions', patterns: [/^DIMENSIONS:?/i, /^SAREE\s*LENGTH:?/i, /^LENGTH:?/i] },
  { field: 'blouseDetails', patterns: [/^BLOUSE\s*DETAILS:?/i, /^BLOUSE:?/i, /^BLOUSE\s*PIECE:?/i] },
  { field: 'washCare', patterns: [/^WASH\s*CARE:?/i, /^WASH\s*&\s*STORAGE\s*CARE:?/i, /^CARE:?/i] },
  { field: 'shortDescription', patterns: [/^SHORT\s*DESCRIPTION:?/i, /^SHORT\s*SUMMARY:?/i, /^SUMMARY:?/i] },
  { field: 'description', patterns: [/^PRODUCT\s*DESCRIPTION:?/i, /^FULL\s*CRAFT\s*STORY:?/i, /^DESCRIPTION:?/i, /^ABOUT:?/i] },
  { field: 'isPublished', patterns: [/^PUBLISHED:?/i, /^STATUS:?/i, /^IS\s*PUBLISHED:?/i] },
  { field: 'isNewArrival', patterns: [/^NEW\s*ARRIVAL:?/i, /^IS\s*NEW\s*ARRIVAL:?/i] },
  { field: 'isBestseller', patterns: [/^BESTSELLER:?/i, /^IS\s*BESTSELLER:?/i] },
  { field: 'isFeatured', patterns: [/^FEATURED:?/i, /^IS\s*FEATURED:?/i] },
  { field: 'images', patterns: [/^IMAGE\s*URLS?:?/i, /^IMAGES?:?/i, /^PHOTOS?:?/i] },
];

export function SmartAutoFillBox({ categories, onAutoFill }: SmartAutoFillBoxProps) {
  const [inputText, setInputText] = React.useState('');
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<'blank' | 'sample' | null>(null);

  const handleCopyBlank = async () => {
    try {
      await navigator.clipboard.writeText(BLANK_TEMPLATE);
      setCopiedType('blank');
      setFeedbackMessage('Copied blank template format to clipboard! You can fill it in and paste below.');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      setInputText(BLANK_TEMPLATE);
      setFeedbackMessage('Inserted blank template format directly into text box.');
    }
  };

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_TEMPLATE);
      setCopiedType('sample');
      setFeedbackMessage('Copied Flourish Women\'s sample saree format to clipboard.');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      setInputText(SAMPLE_TEMPLATE);
      setFeedbackMessage('Inserted Flourish Women\'s sample saree format directly into text box.');
    }
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_TEMPLATE);
    executeParse(SAMPLE_TEMPLATE);
  };

  const executeParse = (rawText: string) => {
    const text = rawText.trim();
    if (!text) {
      setFeedbackMessage('Please paste formatted text in the box before auto-filling.');
      return;
    }

    const lines = text.split('\n');
    const rawData: Record<string, string[]> = {};
    let currentField: string | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // Check if this line starts a new field key
      let matchedField: string | null = null;
      let remainder = '';

      for (const matcher of KEY_MATCHERS) {
        for (const pattern of matcher.patterns) {
          const m = line.match(pattern);
          if (m) {
            matchedField = matcher.field;
            remainder = line.substring(m[0].length).trim();
            if (remainder.startsWith(':')) {
              remainder = remainder.substring(1).trim();
            }
            break;
          }
        }
        if (matchedField) break;
      }

      if (matchedField) {
        currentField = matchedField;
        rawData[currentField] = [];
        if (remainder) {
          rawData[currentField].push(remainder);
        }
      } else if (currentField) {
        if (line) {
          rawData[currentField].push(line);
        }
      }
    }

    // Build the payload
    const payload: AutoFillPayload = {};
    let fieldsCount = 0;

    const getValue = (field: string) => rawData[field]?.join('\n').trim();

    if (getValue('name')) {
      payload.name = getValue('name');
      payload.slug = slugify(getValue('name'));
      fieldsCount++;
    }

    if (getValue('slug')) {
      payload.slug = slugify(getValue('slug'));
      fieldsCount++;
    }

    if (getValue('sku')) {
      payload.sku = getValue('sku');
      fieldsCount++;
    }

    if (getValue('price')) {
      const cleanNum = getValue('price').replace(/[^0-9.]/g, '');
      if (cleanNum) {
        payload.price = cleanNum;
        fieldsCount++;
      }
    }

    if (getValue('comparePrice')) {
      const cleanNum = getValue('comparePrice').replace(/[^0-9.]/g, '');
      if (cleanNum) {
        payload.comparePrice = cleanNum;
        fieldsCount++;
      }
    }

    if (getValue('availability')) {
      const v = getValue('availability').toLowerCase();
      if (v.includes('out') || v.includes('sold')) payload.availability = 'out_of_stock';
      else if (v.includes('made') || v.includes('order')) payload.availability = 'made_to_order';
      else payload.availability = 'in_stock';
      fieldsCount++;
    }

    if (getValue('fabric')) {
      payload.fabric = getValue('fabric');
      fieldsCount++;
    }

    if (getValue('sareeType')) {
      payload.sareeType = getValue('sareeType');
      fieldsCount++;
    }

    if (getValue('color')) {
      payload.color = getValue('color');
      fieldsCount++;
    }

    if (getValue('occasion')) {
      payload.occasion = getValue('occasion');
      fieldsCount++;
    }

    if (getValue('dimensions')) {
      payload.dimensions = getValue('dimensions');
      fieldsCount++;
    }

    if (getValue('blouseDetails')) {
      payload.blouseDetails = getValue('blouseDetails');
      fieldsCount++;
    }

    if (getValue('washCare')) {
      payload.washCare = getValue('washCare');
      fieldsCount++;
    }

    if (getValue('shortDescription')) {
      payload.shortDescription = getValue('shortDescription');
      fieldsCount++;
    }

    if (getValue('description')) {
      payload.description = getValue('description');
      fieldsCount++;
    }

    const parseBool = (str: string | undefined): boolean | undefined => {
      if (!str) return undefined;
      const lower = str.toLowerCase();
      return lower.includes('yes') || lower.includes('true') || lower.includes('1') || lower.includes('published') || lower.includes('active');
    };

    if (getValue('isPublished') !== undefined) {
      payload.isPublished = parseBool(getValue('isPublished'));
      fieldsCount++;
    }

    if (getValue('isNewArrival') !== undefined) {
      payload.isNewArrival = parseBool(getValue('isNewArrival'));
      fieldsCount++;
    }

    if (getValue('isBestseller') !== undefined) {
      payload.isBestseller = parseBool(getValue('isBestseller'));
      fieldsCount++;
    }

    if (getValue('isFeatured') !== undefined) {
      payload.isFeatured = parseBool(getValue('isFeatured'));
      fieldsCount++;
    }

    // Category mapping
    const catRaw = getValue('categoryName');
    if (catRaw && categories.length > 0) {
      const cleanCat = catRaw.toLowerCase();
      const matched = categories.find(
        (c) =>
          c.name.toLowerCase() === cleanCat ||
          c.slug.toLowerCase() === cleanCat ||
          c.name.toLowerCase().includes(cleanCat) ||
          cleanCat.includes(c.name.toLowerCase())
      );
      if (matched) {
        payload.categoryId = matched.id;
        fieldsCount++;
      }
    }

    // Images
    const imgsRaw = getValue('images');
    if (imgsRaw) {
      const foundUrls = imgsRaw
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http'));
      if (foundUrls.length > 0) {
        payload.images = foundUrls.slice(0, 5);
        fieldsCount++;
      }
    }

    if (fieldsCount === 0) {
      setFeedbackMessage('Could not detect product fields. Please click "COPY BLANK FORMAT" to see the expected template.');
      return;
    }

    onAutoFill(payload);
    setFeedbackMessage(`✓ All ${fieldsCount} product fields have been auto-filled 100%!`);
  };

  return (
    <div className="bg-[#F0F9FF]/40 border-2 border-dashed border-[#0284C7]/40 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs transition-all">
      {/* Top Header Row with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 fill-[#0284C7]" />
          </div>
          <div>
            <span className="font-sans font-bold text-xs sm:text-sm tracking-wide text-[#0F172A] block uppercase">
              Smart Copy-Paste Auto-Fill (100% Field Mapping)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Copy Blank Format */}
          <button
            type="button"
            onClick={handleCopyBlank}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#CBD5E1] hover:border-[#94A3B8] text-[#0F172A] rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
            title="Copy empty template to clipboard"
          >
            {copiedType === 'blank' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            )}
            <span>{copiedType === 'blank' ? 'Copied Blank!' : 'Copy Blank Format'}</span>
          </button>

          {/* 2. Copy Sample Format */}
          <button
            type="button"
            onClick={handleCopySample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#CBD5E1] hover:border-[#94A3B8] text-[#0F172A] rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
            title="Copy Flourish Women's sample format"
          >
            {copiedType === 'sample' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            )}
            <span>{copiedType === 'sample' ? 'Copied Sample!' : 'Copy Sample Format'}</span>
          </button>

          {/* 3. Load & Auto-Fill Sample */}
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] active:bg-[#075985] text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-[#0284C7]/25 cursor-pointer"
            title="Immediately load and apply Flourish Women's sample saree data"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Load & Auto-Fill Sample</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#64748B] leading-relaxed">
        Paste your formatted product text below — all boxes (Name, Slug, SKU, Category, Prices, Specs, Status checkboxes, and Full Product Description) auto-fill immediately!
      </p>

      {/* Monospace Input Area */}
      <div className="relative">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`PRODUCT NAME:\nFlourish Royal Kanchipuram Pure Silk Saree\n\nPRODUCT SLUG:\nflourish-royal-kanchipuram-pure-silk-saree\n\nSKU:\nFW-KNC-001\n\nCATEGORY:\nKanchipuram Sarees\n\nSELLING PRICE:\n18500\n\nFABRIC:\nPure Mulberry Silk...`}
          className="w-full bg-white border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 rounded-xl p-3.5 font-mono text-xs text-[#0F172A] placeholder-[#94A3B8] leading-relaxed resize-y shadow-2xs focus:outline-none transition-all"
        />
      </div>

      {/* Bottom Feedback + Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs">
          {feedbackMessage ? (
            <span
              className={
                feedbackMessage.startsWith('✓')
                  ? 'text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg'
                  : 'text-[#0284C7] font-medium'
              }
            >
              {feedbackMessage}
            </span>
          ) : (
            <span className="text-[11px] text-[#94A3B8] font-medium">
              Tip: Click &quot;Copy Blank Format&quot; to copy the template, fill it in Notepad or WhatsApp, and paste here.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => executeParse(inputText)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#071324] hover:bg-[#0E2038] active:bg-[#050F1D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-black/20 cursor-pointer self-end sm:self-auto shrink-0"
        >
          <Zap className="w-4 h-4 text-[#38BDF8] fill-[#38BDF8]" />
          <span>Auto-Fill Fields From Text</span>
        </button>
      </div>
    </div>
  );
}
