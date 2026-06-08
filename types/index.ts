import type { PortableTextBlock } from "@portabletext/types";

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteInfoType = {
  _id: string;
  siteTitle: string;
  tagline?: string;
  heroImages?: { url: string; lqip?: string }[];
  aboutTitle?: string;
  aboutText?: PortableTextBlock[];
  email?: string;
  phoneNumber?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  faq?: FaqItem[];
};

export type EventPhoto = {
  url: string;
  width?: number;
  height?: number;
  /** Low-quality image placeholder (base64) for blur-up. */
  lqip?: string;
};

export type EventType = {
  _id: string;
  title: string;
  date: string;
  photos?: EventPhoto[];
};
