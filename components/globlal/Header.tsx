// Header.tsx (Server Component)
import {
  fetchCategories,
  getPublishers,
  getWriters,
} from "@/app/shared/fetchData";
import HeaderClient from "./HeaderClient"; // Make sure it's exported properly

const Header = async () => {
  const categories = await fetchCategories();
  const writers = await getWriters();
  const publishers = await getPublishers();

  return (
    <HeaderClient
      categories={categories}
      writers={writers}
      publishers={publishers}
    />
  );
};

export default Header;
