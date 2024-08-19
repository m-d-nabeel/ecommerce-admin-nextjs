import prismaDb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;
    if (!userId) return new NextResponse("unauthorized", { status: 401 });
    if (!name) return new NextResponse("name is required", { status: 400 });
    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const store = await prismaDb.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });
    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const store = await prismaDb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
