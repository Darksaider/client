import { Timer } from "./timer";
import { Slider } from "./Slider";

export const SliderSection: React.FC = () => {
  return (
    <section className="flex  h-screen">
      <Timer targetDate="2026-01-01T00:00:00" />
      <Slider />
    </section>
  );
};
