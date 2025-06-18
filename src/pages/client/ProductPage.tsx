import { useParams } from "react-router";
import { useProductItem } from "../../hooks/useProductItem";
import { ProductImages } from "../../components/ProductSlider";
import { ProductItemInfo } from "../../components/ProductItemInfo";
import { ProductAction } from "../../components/ProductPageActions";
import { Loader } from "../../components/Loader";
import { Comments } from "./Comments";

export const ProductPage = () => {
  const { id: productIdString } = useParams<{ id?: string }>();
  if (!productIdString) {
    return <div>Продукт відсутній</div>;
  }
  const productIdNumber = parseInt(productIdString, 10);

  const {
    data: itemData,
    isLoading,
    isError,
    error,
  } = productIdNumber !== undefined
    ? useProductItem(productIdNumber)
    : {
        data: null,
        isLoading: false,
        isError: true,
        error: new Error("Invalid Product ID"),
      };

  const productImages =
    itemData?.product_photos?.map((photo) => photo.photo_url) || [];
  if (isLoading) {
    return (
      <div className="black">
        <Loader size="xl" variant="success" text="Завантаження даних..." />;
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-4 text-center text-red-600">
        Помилка: {error?.message || "Не вдалося завантажити товар"}
      </p>
    );
  }

  if (!itemData) {
    return <p className="p-4 text-center">Товар не знайдено</p>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
      <title>{itemData.name}</title>
      <div className=" lg:grid lg:grid-cols-2 gap-8 ">
        <ProductImages images={productImages} />
        <div>
          <ProductItemInfo itemData={itemData} />
          <ProductAction itemData={itemData} productId={productIdNumber} />
        </div>
      </div>
      <Comments productId={productIdNumber} />
    </div>
  );
};
