import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}
