"use client";

import { Icon } from "@/compoents/atoms";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, { FC, useMemo } from "react";

import { Link, usePathname } from "@/utils/navigation";
import { pages } from "@/utils/variables";

interface BreadCrumbProps {
  getDefaultTextGenerator?: (subpath: string, href: string) => string;
}

type PageNameType = "cart" | "checkout" | "hookah" | "tobacco";

const generatePathParts = (pathStr: string) => {
  const pathWithoutQuery = pathStr.split("?")[0];
  return pathWithoutQuery.split("/").filter((v) => v.length > 0);
};

const Breadcrumb: FC<BreadCrumbProps> = ({
  getDefaultTextGenerator = (path: string) => path
}) => {
  const t = useTranslations("Breadcrumb");
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const asPathNestedRoutes = generatePathParts(pathname);

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      return {
        href,
        text: getDefaultTextGenerator(subpath, href)
      };
    });
    const penultimateItem = crumbList.at(-2);

    const breadcrumbs = [
      {
        href: "/",
        text: (
          <Icon
            className="w-6 h-6 fill-primary-base active:fill-primary-hover md:group-hover:fill-primary-hover"
            type="HomeIcon"
          />
        )
      }
    ];
    return penultimateItem ? [...breadcrumbs, penultimateItem] : breadcrumbs;
  }, [pathname, getDefaultTextGenerator]);

  if (!pathname.length) {
    return null;
  }

  return (
    <div className="mb-10">
      <ul className="flex gap-1 items-center mb-2 md:mb-8 overflow-x-auto">
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <li
              key={index}
              className={clsx(
                "text-primary-base font-bold group hover:text-primary-hover flex gap-1 items-center",
                // { "!text-primary": breadcrumbs.length === index + 1 }
              )}
            >
              <Link
                className="p-1 text-inherit text-nowrap"
                href={breadcrumb.href}
              >
                {typeof breadcrumb.text === "string" &&
                pages.includes(breadcrumb.text)
                  ? t(breadcrumb.text as "cart")
                  : breadcrumb.text}
              </Link>
              {breadcrumbs.length !== index + 1 && (
                <Icon
                  type="ChevronRightIcon"
                  className="stroke-primary-base stroke-3 w-4 h-4 group-hover:stroke-primary-hover rotate-180"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { Breadcrumb };
