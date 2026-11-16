"use server";

import { headers } from "next/headers";

const isMobileUserAgent = (userAgent: string) => {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent);
};

export const getIsMobile = async () => {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = isMobileUserAgent(userAgent);
  return isMobile;
};
