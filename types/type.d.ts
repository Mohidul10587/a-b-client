interface FetchDataResponse<T> {
  success: boolean;
  message: string;
  resData: T | null;
}

interface IBanner {
  _id?: string;
  title: string;
  banners: {
    img: string; // image URL only
    title: string;
    link: string;
  }[];
}
interface Props<T> {
  id?: string;
  initialData: T;
  pagePurpose: "add" | "edit";
}
interface IQnA {
  title: string;
  description: string;
}

interface ICategory {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  title: string; // Category name
  slug: string;
  img: string;
  metaImg: string;
  position: number;
  commissionForSeller: number;
  display: boolean;
  queAndAnsArray: IQnA[];
}
interface ISubcategory {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  title: string;
  slug?: string;
  img: string;
  metaImg: string;
  position: number;
  commissionForSeller: number;
  display: boolean;
  parentCategory: string;
  queAndAnsArray: QnA[];
}
