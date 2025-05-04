import React from "react";
import bannerImage1 from "../assets/bannerImage1.png";
import bannerImage2 from "../assets/bannerImage2.png";
import bannerImage3 from "../assets/bannerImage3.png";
import bannerImage4 from "../assets/bannerImage4.png";
import sale from "../assets/SALE.svg";
import { Button } from "../UI/AnchorButton";

export const FusionBanner: React.FC = () => {
  return (
    <div className="hidden md:grid grid-cols-3 gap-6 h-[90vh]">
      <div className="rounded-lg overflow-hidden h-full  hidden md:block relative bg-zinc-200">
        <img
          src={bannerImage1}
          alt="Чоловік у сірому светрі"
          className="absolute bottom-0 "
        />
      </div>
      {/* Колонка 2 */}
      <div className="grid grid-rows-[1fr_2fr_1fr] gap-6 h-full min-h-0">
        <div className="rounded-lg overflow-hidden h-full bg-zinc-200">
          <img
            src={bannerImage2}
            alt="Група жінок"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center items-center text-center font-Montserrat py-4 gap-4 h-full bg-white rounded-lg shadow-md">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-800">
            ULTIMATE
          </h2>
          <div>
            <img src={sale} alt="Sale" className="w-3/4 max-w-xs mx-auto" />
            <p className="text-base lg:text-lg uppercase tracking-widest mt-1">
              NEW COLLECTION
            </p>
          </div>
          <Button className="bg-black text-white w-full sm:w-3/4 lg:w-1/2">
            Shop now
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden h-full">
          <img
            src={bannerImage3}
            alt="Дівчата сміються"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="rounded-lg overflow-hidden h-full  bg-zinc-200">
        <img
          src={bannerImage4}
          alt="Чоловік у помаранчевому светрі"
          className=" object-contain h-full w-full"
        />
      </div>
    </div>
  );
};
