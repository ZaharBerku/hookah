"use client";

import clsx from "clsx";
import Image from "next/image";
import { ComponentProps, FC } from "react";

import { Link } from "@/utils/navigation";
import { Category } from "@/utils/types";

interface BrandProps extends ComponentProps<"input"> {
  label: string;
  avatar: string;
  slug: string;
  category: Category;
}

interface DynamicLinkListListProps {
  list: any;
  category: Category;
  type?: string;
}

const Brand: FC<BrandProps> = ({ label, avatar, slug, category, type }) => {
  return (
    <Link
      href={type ? `/${category}/${type}/${slug}` : `/${category}/${slug}`}
      className={clsx(
        "flex justify-start border-r-2 border-r-light-dark-accent w-auto active:bg-gray-200 md:hover:bg-gray-200 items-center text-base font-normal text-black cursor-pointer gap-2 px-5 py-2 border border-white border-opacity-20"
      )}
    >
      {avatar && (
        <span className="h-15 w-15 relative">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            src={avatar}
            alt="avatar-branda"
          />
        </span>
      )}
      {label}
    </Link>
  );
};

const DynamicLinkListList: FC<DynamicLinkListListProps> = ({
  list,
  type,
  category
}) => {
  return (
    <div className="p-2">
      <div className="bg-white shadow-3xl shadow-card-shadow-color rounded-3xl overflow-hidden -mr-1">
        <menu className="grid grid-cols-auto-fill-mobile md:grid-cols-auto-fill">
          {list.map((item: any) => {
            return (
              <Brand
                label={item.attributes.name}
                avatar={item.attributes?.logo?.data?.attributes?.url}
                key={item.id}
                category={category}
                slug={item.attributes.slugType || item.attributes.slug}
                type={type}
              />
            );
          })}
        </menu>
      </div>
    </div>
  );
};

export { DynamicLinkListList };
