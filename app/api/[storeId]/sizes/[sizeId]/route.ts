import prismaDb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("billboardId is required", {
        status: 400,
      });

    const size = await prismaDb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!name || !value)
      return new NextResponse("name and value are required", { status: 400 });

    if (!params.storeId || !params.sizeId)
      return new NextResponse("storeId and sizeId are required", {
        status: 400,
      });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("invalid store id or unauthorized access", {
        status: 403,
      });
    }
    const size = await prismaDb.size.updateMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!params.storeId || !params.sizeId)
      return new NextResponse("storeId and sizeId are required", {
        status: 400,
      });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("invalid store id or unauthorized access", {
        status: 403,
      });
    }

    const size = await prismaDb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
