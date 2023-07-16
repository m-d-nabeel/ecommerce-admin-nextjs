import prismaDb from "@/lib/prisma-db";

export const getStockCount = async (storeId: string) => {
  return await prismaDb.product.count({
    where: {
      storeId: storeId,
      isArchived: false,
    },
  });
};
