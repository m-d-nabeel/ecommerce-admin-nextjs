import prismaDb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId)
      return new NextResponse("productId is required", {
        status: 400,
      });

    const product = await prismaDb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId)
      return new NextResponse("productId is required", {
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
    await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });
    const product = await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!params.storeId || !params.productId)
      return new NextResponse("storeId and productId are required", {
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

    const product = await prismaDb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
