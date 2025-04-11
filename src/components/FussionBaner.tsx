import React from "react";
import bannerImage1 from "../assets/bannerImage1.png";
import bannerImage2 from "../assets/bannerImage2.png";
import bannerImage3 from "../assets/bannerImage3.png";
import bannerImage4 from "../assets/bannerImage4.png";
import sale from "../assets/SALE.svg";
import Button from "../UI/AnchorButton";

export const FusionBanner: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] md:min-h-[92vh] py-3 md:py-2 rounded-lg overflow-hidden">
      {/* Mobile version */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Top hero section with ULTIMATE and SALE */}
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-bold text-gray-800 font-Montserrat text-center">
            ULTIMATE
          </h2>
          <div className="my-4 text-center">
            <img src={sale} alt="Sale" className="w-32 mx-auto" />
            <p className="text-base uppercase tracking-widest mt-2 font-Montserrat">
              NEW COLLECTION
            </p>
          </div>
          <Button className="bg-black text-white w-full mt-2">Shop now</Button>
        </div>

        {/* Image grid for mobile - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg overflow-hidden aspect-[3/4]">
            <img
              src={bannerImage1}
              alt="Чоловік у сірому светрі"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="rounded-lg overflow-hidden aspect-[3/4]">
            <img
              src={bannerImage2}
              alt="Група жінок"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="rounded-lg overflow-hidden aspect-[3/4]">
            <img
              src={bannerImage3}
              alt="Дівчата сміються"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="rounded-lg overflow-hidden aspect-[3/4]">
            <img
              src={bannerImage4}
              alt="Чоловік у помаранчевому светрі"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Desktop version */}
      <div className="hidden md:grid grid-cols-3 gap-10 h-full">
        {/* First column */}
        <div className="rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={bannerImage1}
            alt="Чоловік у сірому светрі"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Middle column */}
        <div
          className="grid grid-rows-3 gap-10 h-full"
          style={{ gridTemplateRows: "1fr 2fr 1fr" }}
        >
          <div className="rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={bannerImage2}
              alt="Група жінок"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-between py-2 items-center font-Montserrat">
            <div className="text-center">
              <h2 className="text-8xl font-bold text-gray-800">ULTIMATE</h2>
            </div>

            <div className="text-center">
              <img src={sale} alt="Sale" className="w-auto mx-auto" />
              <p className="text-lg uppercase tracking-widest mt-1">
                NEW COLLECTION
              </p>
            </div>

            <Button className="bg-black text-white w-1/2">Shop now</Button>
          </div>

          <div className="rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={bannerImage3}
              alt="Дівчата сміються"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Last column */}
        <div className="rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={bannerImage4}
            alt="Чоловік у помаранчевому светрі"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
