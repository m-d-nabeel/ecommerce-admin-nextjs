"use client";

import StoreSwitch from "@/components/store-switch";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { isOpen, onOpen } = useStoreModal();

  // useEffect(() => {
  //   if (!isOpen) onOpen();
  // }, [isOpen, onOpen]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex h-16 items-center border-b px-4 sm:px-8">
        <StoreSwitch items={[]} />
        <div className="flex items-center ml-auto gap-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="text-center h-full flex-col items-center flex justify-center">
        <Heading
          title="No Store Found!"
          description="You currently have no store, create one to continue."
        />
        <Button variant="outline" className="w-40 m-6" onClick={onOpen}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Store
        </Button>
      </div>
    </div>
  );
}
