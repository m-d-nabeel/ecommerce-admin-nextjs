import { format } from "date-fns";

import prismaDb from "@/lib/prisma-db";
import { CategoryColumn } from "./components/columns";
import CategoryClient from "./components/client";

const CategoriesPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  const categories = await prismaDb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 p-8 pt-6 gap-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
