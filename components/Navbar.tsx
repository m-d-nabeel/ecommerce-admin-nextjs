import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import MainNav from "@/components/main-nav";
import StoreSwitch from "@/components/store-switch";
import prismaDb from "@/lib/prisma-db";
import { ModeToggle } from "@/components/theme-toggle";

export default async function Navbar() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const stores = await prismaDb.store.findMany({
    where: {
      userId: userId,
    },
  });
  return (
    <nav className="w-full flex h-16 items-center border-b px-4 sm:px-8">
      <StoreSwitch items={stores} />
      <MainNav />
      <div className="ml-auto flex tems-center gap-x-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
