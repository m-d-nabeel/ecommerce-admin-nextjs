import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prisma-db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!name) return new NextResponse("name are required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("images are required", { status: 400 });
    if (!price) return new NextResponse("price are required", { status: 400 });
    if (!categoryId)
      return new NextResponse("categoryId are required", { status: 400 });
    if (!sizeId)
      return new NextResponse("sizeId are required", { status: 400 });
    if (!colorId)
      return new NextResponse("colorId are required", { status: 400 });

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

    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        categoryId,
        sizeId,
        colorId,
        storeId: params.storeId,
        isFeatured,
        isArchived,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

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

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
