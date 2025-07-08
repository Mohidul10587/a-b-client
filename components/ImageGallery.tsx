"use client";

import ImageGalleryJsx from "./ImageGalleryJsx";

const ImageGallery: React.FC<{
  isOpen: boolean;
  setData: any;
  onClose: () => void;
  img: string;
  index?: number;
  dynamicBoxIndex?: number;
  dynamicBoxImagesIndex?: number;
}> = ({
  isOpen,
  onClose,
  setData,
  img,
  index,
  dynamicBoxIndex,
  dynamicBoxImagesIndex,
}) => {
  const handleImage = (item: any) => {
    if (img === "banner") {
      setData((prevData: any) => ({
        ...prevData,
        banners: prevData.banners.map((banner: any, i: number) =>
          i === index ? { ...banner, img: item.img } : banner
        ),
      }));
    } else if (img === "variantImage") {
      setData((prevData: any) => ({
        ...prevData,
        variantSectionInfo: prevData.variantSectionInfo.map(
          (section: any, i: number) =>
            i === index ? { ...section, img: item.img } : section
        ),
      }));
    } else if (img === "attachedFiles") {
      setData((prevData: any) => ({
        ...prevData,
        attachedFiles: [...prevData.attachedFiles, item.img],
      }));
    } else if (img === "suggestionPhoto") {
      setData(item.img);
    } else if (img === "banner_mainImage") {
      setData((prevData: any) => ({
        ...prevData,
        dynamicBox: prevData.dynamicBox.map((box: any, i: number) =>
          i === dynamicBoxIndex ? { ...box, mainImage: item.img } : box
        ),
      }));
    } else if (img === "betterModel") {
      setData((prevData: any) => ({
        ...prevData,
        fields: prevData.fields.map((box: any, i: number) =>
          i === index ? { ...box, photo: item.img } : box
        ),
      }));
    } else if (img === "imageOfDynamicBoxImages") {
      setData((prevData: any) => ({
        ...prevData,
        dynamicBox: prevData.dynamicBox.map((box: any, i: number) => {
          if (i === dynamicBoxIndex) {
            const updatedImages = box.images.map((imgObj: any, j: number) =>
              j === dynamicBoxImagesIndex
                ? { ...imgObj, image: item.img }
                : imgObj
            );
            return { ...box, images: updatedImages };
          }
          return box;
        }),
      }));
    } else if (img === "metaImage") {
      setData((prevData: any) => ({
        ...prevData,
        metaImage: item.img,
      }));
    } else if (img === "photo") {
      setData((prevData: any) => ({
        ...prevData,
        photo: item.img,
      }));
    } else {
      setData((prevData: any) => ({
        ...prevData,
        [img]: item.img,
      }));
    }

    onClose();
  };
  if (!isOpen) return null;

  return <ImageGalleryJsx onClose={onClose} handleImage={handleImage} />;
};

export default ImageGallery;
