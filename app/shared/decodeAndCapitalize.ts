export const decodeAndCapitalizeFirstLetter = (encodedString: string) => {
  const decodedString = decodeURIComponent(encodedString);
  return decodedString.charAt(0).toUpperCase() + decodedString.slice(1);
};
