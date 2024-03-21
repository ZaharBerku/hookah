"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, FC } from "react";

interface BreadCrumbProps {
  separator: ReactNode;
  homeElement?: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
}

const Breadcrumb: FC<BreadCrumbProps> = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks
}) => {
  const paths = usePathname();
  const pathNames = paths
    .split("/")
    .filter((path) => path && !["ru", "uk"].includes(path));

  return (
    <div>
      <ul className={containerClasses}>
        {homeElement && (
          <li className={listClasses}>
            <Link href={"/"}>{homeElement}</Link>
          </li>
        )}
        {pathNames.length > 0 && separator}
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          let itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          let itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1, link.length)
            : link;
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
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
