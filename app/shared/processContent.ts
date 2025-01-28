export const processContent = (content: string): string => {
  const cleanedContent = content?.replace(/(<([^>]+)>)/gi, "").trim();
  return cleanedContent?.length > 0 ? content : "";
};
