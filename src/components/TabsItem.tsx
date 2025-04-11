type TabsItemProps = {
  product: {
    image: string;
    title: string;
    brand: string;
    price: string;
  };
};

export const TabsItem: React.FC<TabsItemProps> = ({ product }) => {
  return (
    <div>
      <img src={product.image} alt="" />
      <div>
        <span>{product.title}</span>
        <span>{product.brand}</span>
      </div>
      <span>{product.price}</span>
    </div>
  );
};
