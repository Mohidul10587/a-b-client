// src/types/product.d.ts

export interface IProduct {
  titleEnglish: string;
  // A
  ISBN: string;
  _id?: string;

  // B
  binding: string;
  brand: any;
  // C
  category: any;

  // D
  description: string;
  display_2: boolean;
  display: boolean;

  // E
  edition: string;
  existingQnt: number;

  // I
  img: string;

  // K
  keywords: string[];

  // L
  language: string;

  // M
  metaDescription: string;
  metaImg: string;
  metaTitle: string;

  // N
  numberOfPage: number;

  // O
  orderType: string;

  // P
  productType: string;
  publisher: string;

  // R
  regularPrice: number;

  // S
  seller: any;
  sellingPrice: number;
  shippingInside: number;
  shippingOutside: number;
  shortDescription: string;
  slug: string;
  stockStatus: string;
  subTitle: string;
  subcategory: string;
  suggestion: string;
  summary: string;

  // T
  titleBn: string;
  titleEn: string;
  translatorName: string;

  // W
  writer: any;

  // Y
  youtubeVideo: string[];
}
