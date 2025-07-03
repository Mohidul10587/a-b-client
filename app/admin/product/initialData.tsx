// types/product.d.ts or types/index.ts

export interface IProduct {
  publisher: string;
  summary: string;
  numberOfPage: number;
  ISBN: string;
  edition: string;
  binding: string;
  productType: string;
  translatorName: string;
  language: string;
  orderType: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  metaValue: string;
  title: string;
  titleEnglish: string;
  subTitle: string;
  description: string;
  shortDescription: string;
  category: string;
  sellingPrice: number;
  regularPrice: number;
  stockStatus: string;
  writer: string;
  youtubeVideo: string;
  shippingInside: number;
  shippingOutside: number;
  img: string;
  suggestionId: string;
  metaImg: string;
  subcategory: string;
}
export const initialData: IProduct = {
  publisher: "",
  summary: "",
  numberOfPage: 0,
  ISBN: "",
  edition: "",
  binding: "",
  productType: "",
  translatorName: "",
  language: "bn",
  orderType: "",
  metaTitle: "",
  metaDescription: "",
  tags: "",
  metaValue: "",
  title: "",
  titleEnglish: "",
  subTitle: "",
  description: "",
  shortDescription: "",
  category: "",
  sellingPrice: 0,
  regularPrice: 0,
  stockStatus: "",
  writer: "",
  youtubeVideo: "",
  shippingInside: 50,
  shippingOutside: 50,
  img: "",
  suggestionId: "",
  metaImg: "",
  subcategory: "",
};
