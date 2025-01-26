"use client";

import clsx from "clsx";
import Image from "next/image";
import { ComponentProps, FC } from "react";

import { Link } from "@/utils/navigation";
import { CategoryType } from "@/utils/types";

import { BrandSkeleton } from "./BrandSkeleton";

interface BrandProps extends ComponentProps<"input"> {
  label: string;
  avatar: string;
  slug: string;
  category: CategoryType;
}

interface DynamicLinkListListProps {
  list: any;
  category: CategoryType;
  type?: string;
}

const Brand: FC<BrandProps> = ({ label, avatar, slug, category, type }) => {
  return (
    <Link
      href={type ? `/${category}/${type}/${slug}` : `/${category}/${slug}`}
      className={clsx(
        "flex justify-start border-r-2 border-r-light-dark-accent w-auto active:bg-gray-200 md:hover:bg-gray-200 items-center text-sm md:text-base font-normal text-black cursor-pointer gap-2 px-2 md:px-5 py-2 border border-white border-opacity-20"
      )}
    >
      {avatar && (
        <span className="h-8 min-w-8 md:h-15 md:min-w-15 relative">
          <Image
            fill
            loading="lazy"
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
          {list
            ? list.map((item: any) => {
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
              })
            : Array.from({ length: 5 }).map((_, index) => (
                <BrandSkeleton key={index} />
              ))}
        </menu>
      </div>
    </div>
  );
};

export { DynamicLinkListList };
