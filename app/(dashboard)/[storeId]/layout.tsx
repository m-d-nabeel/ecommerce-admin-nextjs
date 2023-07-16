import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismaDb from "@/lib/prisma-db";
import Navbar from "@/components/navbar";

type props = {
  children: React.ReactNode;
  params: { storeId: string };
};

export default async function DashboardLayout({ children, params }: props) {
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
    <>
      <Navbar />
      {children}
    </>
  );
}
