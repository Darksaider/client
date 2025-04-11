import { Filter } from "../../components/Filter";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Products } from "../../components/Products";

export const ProductsPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex">
        <Filter />
        <Products />
      </main>
      <Footer />
    </>
  );
};
