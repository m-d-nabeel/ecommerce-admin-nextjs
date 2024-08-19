import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prisma-db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });
    if (!name) return new NextResponse("name is required", { status: 400 });

    const store = await prismaDb.store.create({
      data: {
        name: name,
        userId: userId,
      },
    });
    
    return NextResponse.json(store);

  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
