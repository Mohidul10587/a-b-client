import { IBanner } from "./banner";

export interface IFormData {
  targetedPageId: string;
  sectionTitle: string;
  link: string;
  status: boolean;
  titleLink: string;
  titleAlignment: "left" | "center" | "right";
  isTitle: boolean;
  desktopGrid: number;
  mobileGrid: number;
  margin: number;
  padding: number;
  titleBackgroundColor: string;
  sectionBackgroundColor: string;
  boxText: string;
  boxBg: string;
  gridStyle: string;
  productStyle: string;
  postLimit: number;
  display: "both" | "desktop" | "mobile";
  imagePosition: "left" | "right" | "top" | "bottom";
  page: string;
  position: number;
  selectionType: string;
  bannerId: any;
  productSectionId: string;
  images: File[];
  width: number;
  height: number;
  suggestionId: string | null;
}
