import { format } from "date-fns";

import prismaDb from "@/lib/prisma-db";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import OrderClient from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price);
      }, 0)
    ),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 p-8 pt-6 gap-y-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
