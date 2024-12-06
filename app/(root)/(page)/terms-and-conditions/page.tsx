import { fetchSettings } from "@/app/shared/fetchSettingsData";

const IndexPage: React.FC = async () => {
  const settings = await fetchSettings();
  return (
    <>
      <div className="container my-4">
        <div className="bg-white p-4">
          <h1 className="md:text-2xl text-md text-gray-700 mb-4 font-bold">
            Terms and Conditions
          </h1>
          {settings && (
            <div
              dangerouslySetInnerHTML={{ __html: settings.termsAndConditions }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
};
export default IndexPage;
