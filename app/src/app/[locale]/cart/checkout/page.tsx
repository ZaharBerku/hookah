import { CheckoutPage } from "@/componets/pages";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default function Checkout() {
  return <CheckoutPage />;
}
