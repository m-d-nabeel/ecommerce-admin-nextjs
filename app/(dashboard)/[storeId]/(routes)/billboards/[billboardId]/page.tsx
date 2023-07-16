import BillboardForm from "./components/BillboardForm";
import prismaDb from "@/lib/prisma-db";

const BillboardPage = async ({
  params,
}: {
  params: {
    billboardId: string;
  };
}) => {
  const billboard = await prismaDb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
