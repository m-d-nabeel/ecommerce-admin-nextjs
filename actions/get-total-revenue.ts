import prismaDb from "@/lib/prisma-db";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismaDb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce(
    (total, order) =>
      total +
      order.orderItems.reduce(
        (orderSum, orderItem) => orderSum + orderItem.product.price.toNumber(),
        0
      ),
    0
  );

  return totalRevenue;
};
