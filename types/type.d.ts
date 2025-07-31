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

interface IUser {
  _id: string;
  username?: string;
  email?: string;
  phone?: string;
  gmail?: string;
  password?: string;
  role: "user" | "admin" | "seller" | "customerManager";
  name: string;
  slug: string;
  isSeller: boolean;
  isUser: boolean;
  birthday: string;
  gender: string;
  address: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  facebook: string;
  whatsapp: string;
  coverImg: string;
  image?: string;
  img?: string;
  display?: boolean;

  lastLoginAt: Date;
}

type ModalType = "success" | "error" | "info" | "warning" | "loading";

interface IBrand {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  rating: number;
  img: File | string;
  video: string;
  metaTitle: string;
  metaDescription: string;
  metaImg: File | string;
  keywords: string[];
}
