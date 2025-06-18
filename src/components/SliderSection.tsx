import { Timer } from "./Mimtimer";
import { Slider } from "./MainSlider";

export const SliderSection: React.FC = () => {
  return (
    <section className="flex">
      <Timer targetDate="2026-01-01T00:00:00" />
      <Slider />
    </section>
  );
};
