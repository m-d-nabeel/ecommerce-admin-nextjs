import prismaDb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type props = {
  children: React.ReactNode;
};

export default async function SetupLayout({ children }: props) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const store = await prismaDb.store.findFirst({
    where: {
      userId: userId,
    },
  });
  if (store) {
    redirect(`${store.id}`);
  }
  return <>{children}</>;
}
