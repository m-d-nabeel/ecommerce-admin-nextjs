import CategoryForm from "./components/category-form";
import prismaDb from "@/lib/prisma-db";

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryId: string;
    storeId: string;
  };
}) => {
  const category = await prismaDb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });
  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="p-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
