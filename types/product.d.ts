// src/types/product.d.ts

export interface IProduct {
  // A
  ISBN: string;
  _id?: string;

  // B
  binding: string;

  // C
  category: any;

  // D
  description: string;

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
