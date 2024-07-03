import { ErrorPage } from "@/compoents/pages";

import RootLayout from "@/app/[locale]/layout";

export default function NotFound() {
  return (
    <RootLayout params={{ locale: "uk" }}>
      <ErrorPage />
    </RootLayout>
  );
}
