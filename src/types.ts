export interface Service {
  id?: string;
  title: string;
  description: string;
  benefits: string[];
  startingPrice: string;
  icon: string;
  order: number;
}

export interface PricingPlan {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  order: number;
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link?: string;
  featured: boolean;
  order: number;
}

export interface Testimonial {
  id?: string;
  clientName: string;
  businessName: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface SiteSettings {
  gaTrackingId: string;
  metaTitle: string;
  metaDescription: string;
  contactEmail: string;
  whatsappNumber: string;
  address: string;
}
