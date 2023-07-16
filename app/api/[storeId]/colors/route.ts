import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prisma-db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!name || !value)
      return new NextResponse("name and value are required", { status: 400 });

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

    const color = await prismaDb.color.create({
      data: {
        name: name,
        value: value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
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

    const colors = await prismaDb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
