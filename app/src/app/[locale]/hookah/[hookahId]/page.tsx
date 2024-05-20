import { CartPage } from "@/compoents/pages";

export default async function HookahProduct({
  searchParams
}: {
  searchParams: {
    productId: string;
  };
}) {
  return <CartPage />;
}
