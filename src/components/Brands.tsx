import brand1 from "../assets/brandLogos/calvin.svg";
import brand2 from "../assets/brandLogos/chanel.svg";
import brand3 from "../assets/brandLogos/denim.svg";
import brand4 from "../assets/brandLogos/louis.svg";
import brand5 from "../assets/brandLogos/prada.svg";

export const Brands: React.FC = () => {
  return (
    <div className="flex justify-between py-10">
      <img src={brand1} alt="Calvin" />
      <img src={brand2} alt="Chanel" />
      <img src={brand3} alt="Denim" />
      <img src={brand4} alt="Louis" />
      <img src={brand5} alt="Prada" />
    </div>
  );
};
