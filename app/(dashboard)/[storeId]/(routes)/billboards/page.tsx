import { format } from "date-fns";

import prismaDb from "@/lib/prisma-db";
import { BillboardColumn } from "./components/columns";
import BillboardClient from "./components/client";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 p-8 pt-6 gap-y-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
