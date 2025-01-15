export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFKD") // Normalize Unicode characters
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // Remove special characters except dashes; supports Unicode letters and numbers
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-") // Replace multiple dashes with a single dash
    .trim();
};
