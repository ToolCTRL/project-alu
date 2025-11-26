import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";

interface Props {
  items: { title: string; routePath: string }[];
}

export default function DocBreadcrumb({ items }: Readonly<Props>) {
  return <BreadcrumbSimple menu={[{ title: "Docs", routePath: "/docs" }, ...items]} />;
}
