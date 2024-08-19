import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prisma-db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!name || !billboardId)
      return new NextResponse("name and billboard Id are required", {
        status: 400,
      });

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    const store = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!store) {
      return new NextResponse("invalid store id or unauthorized access", {
        status: 403,
      });
    }
    const billboard = await prismaDb.billboard.findFirst({
      where: {
        id: billboardId,
        storeId: params.storeId,
      },
    });
    if (!billboard) {
      return new NextResponse("invalid billboard id or unauthorized access", {
        status: 403,
      });
    }
    const category = await prismaDb.category.create({
      data: {
        name: name,
        billboardId: billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const store = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("invalid store id", {
        status: 403,
      });
    }

    const categories = await prismaDb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
