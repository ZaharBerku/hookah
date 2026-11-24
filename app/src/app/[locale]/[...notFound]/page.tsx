import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default function NotFound() {
  return notFound();
}
