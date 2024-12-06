
import { PropsWithSlagArray } from "@/types/pageProps";
import UpdateSubcategory from "./UpdateSubcategory";


const UpdateCategoryPage: React.FC<PropsWithSlagArray> =async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <UpdateSubcategory id={id}/>
  
 
};

export default UpdateCategoryPage;
