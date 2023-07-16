import ProductForm from "./components/product-form";
import prismaDb from "@/lib/prisma-db";

const ProductPage = async ({
  params,
}: {
  params: {
    storeId: string;
    productId: string;
  };
}) => {
  const product = await prismaDb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });
  const categories = await prismaDb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const sizes = await prismaDb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prismaDb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="p-8">
        <ProductForm
          initialData={JSON.parse(JSON.stringify(product))}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

/**
 *
 *? Got this error when updating the product
 *! Warning: Only plain objects can be passed
 *! to Client Components from Server Components.
 ** But using JSON.parse(JSON.stringify(product))
 ** removed that error
 *
 */

export default ProductPage;
