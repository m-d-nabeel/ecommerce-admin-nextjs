import prismaDb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("categoryId is required", {
        status: 400,
      });

    const category = await prismaDb.category.findUnique({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!name || !billboardId)
      return new NextResponse("name and billboard id are required", {
        status: 400,
      });

    if (!params.storeId || !params.categoryId)
      return new NextResponse("storeId and categoryId are required", {
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
    const category = await prismaDb.category.updateMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!params.storeId || !params.categoryId)
      return new NextResponse("storeId and categoryId are required", {
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

    const category = await prismaDb.category.deleteMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
