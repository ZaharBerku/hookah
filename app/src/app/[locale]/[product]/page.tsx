import { CartPage } from "@/compoents/pages";

export default async function Product({
  searchParams
}: {
  searchParams: {
    productId: string;
  };
}) {
  console.log(searchParams.productId, "props");
  return <CartPage />;
}
