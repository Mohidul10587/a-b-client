import { fetchSettings } from "@/app/shared/fetchSettingsData";

const IndexPage: React.FC = async () => {
  const settings = await fetchSettings();
  const termsAndConditions = settings?.termsAndConditions || "";
  return (
    <>
      <div className="container my-4">
        <div className="bg-white p-4">
          {settings && (
            <div dangerouslySetInnerHTML={{ __html: termsAndConditions }}></div>
          )}
        </div>
      </div>
    </>
  );
};
export default IndexPage;
