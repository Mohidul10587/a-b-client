import { fetchSettings } from "@/app/shared/fetchSettingsData";

const IndexPage: React.FC = async () => {
  const settings = await fetchSettings();
  return (
    <>
      <div className="container my-4">
        <div className="bg-white p-4">
          {settings && (
            <div
              dangerouslySetInnerHTML={{ __html: settings.privacyPolicies }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
};
export default IndexPage;
