import { format } from "date-fns";

import prismaDb from "@/lib/prisma-db";
import { SizeColumn } from "./components/columns";
import SizeClient from "./components/client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismaDb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 p-8 pt-6 gap-y-4">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
