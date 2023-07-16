import prismaDb from "@/lib/prisma-db";

export const getSalesCount = async (storeId: string) => {
  return await prismaDb.order.count({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });
};
