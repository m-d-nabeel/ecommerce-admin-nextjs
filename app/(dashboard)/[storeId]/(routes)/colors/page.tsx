import { format } from "date-fns";

import prismaDb from "@/lib/prisma-db";
import { ColorColumn } from "./components/columns";
import ColorClient from "./components/client";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismaDb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 p-8 pt-6 gap-y-4">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
