import { Filter } from "../../components/Filter";
import { Products } from "../../components/Products";

export const ProductsPage: React.FC = () => {
  return (
    <div className="flex">
      <Filter />
      <Products />
    </div>
  );
};
