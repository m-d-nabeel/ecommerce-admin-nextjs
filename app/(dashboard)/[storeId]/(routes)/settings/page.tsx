import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismaDb from "@/lib/prisma-db";
import SettingsForm from "./components/settings-form";

interface SettingPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingPageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });
  if (!store) redirect("/");
  return (
    <div className="flex-1 p-8">
      <SettingsForm initialData={store} />
    </div>
  );
};
export default SettingsPage;
