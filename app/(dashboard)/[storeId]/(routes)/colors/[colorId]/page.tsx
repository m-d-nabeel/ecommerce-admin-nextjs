import ColorForm from "./components/color-form";
import prismaDb from "@/lib/prisma-db";

const ColorPage = async ({
  params,
}: {
  params: {
    colorId: string;
  };
}) => {
  const color = await prismaDb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="p-8">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
