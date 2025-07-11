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
  address: string;
  birthday: string;
  city: string;
  coins: number;
  coinsTakingDate: string;
  companyEmail: string;
  companyName: string;
  companyPhone: string;
  contactInfo: string;
  country: string;
  coverPhoto?: string;
  createdAt: string;
  deliveryOption: string;
  deliveryAddresses: {
    _id: ReactNode;
    name: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    region: { title: string; _id: string };
    userCity: { title: string; _id: string };
  }[];
  email?: string;
  facebook: string;
  friday_openingHours: string;
  gender: string;
  gmail: string;
  image?: string;
  isSeller: boolean;
  isUser: boolean;
  linkedin: string;
  lastName: string;
  monday_openingHours: string;
  name: string;
  notifications: {
    _id: string;
    type: "message" | "order" | "offer";
    title: string;
    description: string;
    date: string;
    isRead: boolean;
    link: string;
    img: string;
  }[];

  oneClickPayStartedAt: string;
  password: string;
  phone?: string | null;
  img?: string;
  postalCode: string;
  region: any;
  saturday_openingHours: string;
  skype: string;
  slug: string;
  role: string;
  street: string;
  sunday_openingHours: string;
  thursday_openingHours: string;
  toDaysCoins: number;
  tuesday_openingHours: string;
  twitter: string;
  userCity: any;
  wednesday_openingHours: string;
  whatsapp: string;
}
