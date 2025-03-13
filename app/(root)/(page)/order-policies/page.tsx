import { fetchSettings } from "@/app/shared/fetchSettingsData";

const IndexPage: React.FC = async () => {
  const settings = await fetchSettings();
  const otherPolicies = settings?.otherPolicies || "";

  return (
    <div className="container my-4">
      <div className="bg-white p-4">
        {otherPolicies && (
          <div dangerouslySetInnerHTML={{ __html: otherPolicies }}></div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
