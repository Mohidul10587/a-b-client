import type { Metadata, ResolvingMetadata } from "next";
import { apiUrl } from "@/app/shared/urls";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const product = await fetch(`${apiUrl}/product/${id}`).then((res) =>
    res.json()
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    description: `Order ${product.title} from Price in Kenya with fast delivery across the country and in-store pickup in Nairobi.`,
    openGraph: {
      images: [product.photo, ...previousImages],
    },
  };
}
