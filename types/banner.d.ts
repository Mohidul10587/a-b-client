import { BannerItem } from "./bannerItem";
import { IWriter } from "./writer";
import { ICategory } from "./category";

interface IBanner {
  _id: string;
  position: number;
  link: string;
  title: string;
  subTitle: string;
  display: "0" | "1" | "2";
  style: "0" | "1" | "2" | "3";
  desktopGrid: number;
  mobileGrid: number;
  width: number;
  height: number;
  banners: BannerItem[];
}
