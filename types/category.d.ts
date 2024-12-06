export interface InfoSection {
  _id: ObjectId;
  sectionIcon: string;
  sectionTitle: string;
  fields: Array<{
    _id: ObjectId;
    fieldIcon: string;
    fieldTitle: string;
    content: string;
    display: boolean;
  }>;
}
export interface ISubcategory {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  photo: string;
  description: string;
  metaTitle: string;
  metaDescription: string;

  tags: string[];
}

export interface ICategory {
  _id: ObjectId;
  slug: string;
  categoryName: string;
  description: string;
  infoSections: InfoSection[];
  photoUrl: string;
  display: boolean;
  displayPositionOfHomePage: number;
  subCategories: ISubcategory[];
  categoryProducts: number;
}
