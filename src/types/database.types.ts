export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin' | 'super_admin';
export type ProductAvailability = 'in_stock' | 'out_of_stock' | 'made_to_order';
export type EnquiryStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          banner_url: string | null;
          thumbnail_url: string | null;
          is_featured: boolean;
          display_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description?: string | null;
          banner_url?: string | null;
          thumbnail_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string | null;
          banner_url?: string | null;
          thumbnail_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sku: string | null;
          short_description: string | null;
          description: string | null;
          price: number;
          compare_price: number | null;
          category_id: string | null;
          collection_id: string | null;
          fabric: string | null;
          saree_type: string | null;
          color: string | null;
          occasion: string | null;
          blouse_details: string | null;
          wash_care: string | null;
          dimensions: string | null;
          availability: ProductAvailability;
          is_featured: boolean;
          is_new_arrival: boolean;
          is_bestseller: boolean;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sku?: string | null;
          short_description?: string | null;
          description?: string | null;
          price: number;
          compare_price?: number | null;
          category_id?: string | null;
          collection_id?: string | null;
          fabric?: string | null;
          saree_type?: string | null;
          color?: string | null;
          occasion?: string | null;
          blouse_details?: string | null;
          wash_care?: string | null;
          dimensions?: string | null;
          availability?: ProductAvailability;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          sku?: string | null;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          compare_price?: number | null;
          category_id?: string | null;
          collection_id?: string | null;
          fabric?: string | null;
          saree_type?: string | null;
          color?: string | null;
          occasion?: string | null;
          blouse_details?: string | null;
          wash_care?: string | null;
          dimensions?: string | null;
          availability?: ProductAvailability;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
      };
      hero_banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          cta_text: string | null;
          cta_link: string | null;
          image_desktop_url: string;
          image_mobile_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          image_desktop_url: string;
          image_mobile_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          image_desktop_url?: string;
          image_mobile_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      promotional_banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          badge_text: string | null;
          cta_text: string | null;
          cta_link: string | null;
          image_url: string | null;
          bg_color: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          badge_text?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          image_url?: string | null;
          bg_color?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          badge_text?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          image_url?: string | null;
          bg_color?: string | null;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      reels: {
        Row: {
          id: string;
          title: string;
          video_url: string | null;
          thumbnail_url: string;
          view_count_label: string | null;
          product_id: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          video_url?: string | null;
          thumbnail_url: string;
          view_count_label?: string | null;
          product_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          video_url?: string | null;
          thumbnail_url?: string;
          view_count_label?: string | null;
          product_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          location: string | null;
          content: string;
          rating: number;
          avatar_url: string | null;
          saree_worn: string | null;
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          location?: string | null;
          content: string;
          rating?: number;
          avatar_url?: string | null;
          saree_worn?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_name?: string;
          location?: string | null;
          content?: string;
          rating?: number;
          avatar_url?: string | null;
          saree_worn?: string | null;
          is_featured?: boolean;
          display_order?: number;
          updated_at?: string;
        };
      };
      editorial_content: {
        Row: {
          id: string;
          title: string;
          slug: string;
          subtitle: string | null;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          read_time: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          subtitle?: string | null;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          subtitle?: string | null;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          customer_location: string | null;
          message: string | null;
          status: EnquiryStatus;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          customer_location?: string | null;
          message?: string | null;
          status?: EnquiryStatus;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          customer_location?: string | null;
          message?: string | null;
          status?: EnquiryStatus;
          source?: string | null;
          updated_at?: string;
        };
      };
      enquiry_items: {
        Row: {
          id: string;
          enquiry_id: string;
          product_id: string | null;
          product_name: string;
          product_sku: string | null;
          product_price: number | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id: string;
          product_id?: string | null;
          product_name: string;
          product_sku?: string | null;
          product_price?: number | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          enquiry_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_sku?: string | null;
          product_price?: number | null;
          quantity?: number;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string | null;
          announcement_text: string | null;
          is_announcement_active: boolean;
          whatsapp_number: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          address: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          pinterest_url: string | null;
          youtube_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string;
          tagline?: string | null;
          announcement_text?: string | null;
          is_announcement_active?: boolean;
          whatsapp_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          pinterest_url?: string | null;
          youtube_url?: string | null;
          updated_at?: string;
        };
        Update: {
          site_name?: string;
          tagline?: string | null;
          announcement_text?: string | null;
          is_announcement_active?: boolean;
          whatsapp_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          pinterest_url?: string | null;
          youtube_url?: string | null;
          updated_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          platform?: string;
          url?: string;
          icon?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
      };
    };
  };
}
