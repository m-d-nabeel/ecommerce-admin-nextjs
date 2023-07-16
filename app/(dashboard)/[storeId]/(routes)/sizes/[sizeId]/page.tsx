import SizeForm from "./components/SizeForm";
import prismaDb from "@/lib/prisma-db";

const SizePage = async ({
  params,
}: {
  params: {
    sizeId: string;
  };
}) => {
  const size = await prismaDb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
