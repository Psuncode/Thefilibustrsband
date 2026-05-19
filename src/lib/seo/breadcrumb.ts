export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

export type BreadcrumbList = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

const normalizePath = (path: string): string => {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
};

export const buildBreadcrumbList = (
  siteOrigin: string,
  crumbs: ReadonlyArray<BreadcrumbCrumb>
): BreadcrumbList => {
  if (crumbs.length === 0) {
    throw new Error("buildBreadcrumbList requires at least one crumb");
  }
  const origin = siteOrigin.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${normalizePath(crumb.path)}`
    }))
  };
};
