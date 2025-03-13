// src/types/product.d.ts

export interface IVariant {
  title: string | null;
  variantPrice: number;
  img: string | null | File;
}

export interface IProduct {
  _id: string;
  img: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  featured: string;
  existingQnt: number;
  sele: string;
  price: number;
  unprice: number;
  category: any;
  writer: any;
  stockStatus: string;
  shippingInside: number;
  shippingOutside: number;
  infoSectionsData: InfoSection[];
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  metaTitle: string;
  variantTitle: string;
  variantSectionInfo: IVariant[];
}
export interface InfoSection {
  _id: string;
  sectionIcon: string;
  sectionTitle: string;
  fields: Array<{
    fieldIcon: string;
    fieldTitle: string;
    content: string;
    _id: string;
    display?: boolean; // Add display property to the field
  }>;
}
