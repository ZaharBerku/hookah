"use client";

import { Icon } from "@/compoents/atoms";
import { useLocale } from "next-intl";
import React, { ReactNode, FC } from "react";

import { Link } from "@/utils/navigation";
import { usePathname } from "@/utils/navigation";

interface BreadCrumbProps {
  separator: ReactNode;
  homeElement?: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
}

const pageName = {
  cart: "Корзина",
  checkout: "Контактна інформація"
};

const Breadcrumb: FC<BreadCrumbProps> = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks
}) => {
  const paths = usePathname();
  const currentLocation = useLocale();
  const pathNames = paths
    .split("/")
    .filter((path) => path && !["ru", "uk"].includes(path));
  if (!pathNames.length) {
    return null;
  }
  return (
    <div>
      <ul className={containerClasses}>
        {homeElement && (
          <li className={listClasses}>
            <Link className="p-1" href={"/"}>
              <Icon
                className="w-6 h-6 fill-primary-base active:fill-primary-hover"
                type="HomeIcon"
              />
            </Link>
          </li>
        )}
        {pathNames.length > 0 && separator}
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isSelect = paths === href;
          let itemClasses = isSelect ? activeClasses : listClasses;
          let itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1, link.length)
            : decodeURIComponent(link);
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link className="p-1" href={href}>
                  {pageName[itemLink as "cart"] || itemLink}
                </Link>
              </li>
              {pathNames.length !== index + 1 && separator}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export { Breadcrumb };
