// Function to generate a slug from the title
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except dashes
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-") // Replace multiple dashes with a single dash
    .trim();
};
