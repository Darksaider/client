import { useEffect, useState } from "react";
import Button from "../UI/AnchorButton";

interface TimerProps {
  targetDate: string;
}

interface CourtProps {
  children: React.ReactNode;
}
export const Court: React.FC<CourtProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center font-Digital text-3xl p-3.5 shadow-2xl border border-gray-200 rounded-lg bg-white text-gray-800 w-20 h-20 mx-auto text-center leading-none transition-all duration-300 hover:shadow-lg">
      {children}
    </div>
  );
};

export const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  function calculateTimeLeft() {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Очищення таймера при розмонтуванні
  }, [targetDate]);

  return (
    <div className="text-2xl font-Forum max-w-[35%] py-15 ">
      <span>Deals Of The Month</span>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
        duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
        sollicitudin{" "}
      </p>
      <Button className="bg-black text-white my-10 px-6 rounded-md hover:bg-gray-800 transition duration-300">
        Buy Now
      </Button>
      <div>
        <span>Hurry, Before It’s Too Late!</span>
        <div className="flex justify-center space-x-4">
          <div>
            <Court>{timeLeft.days}</Court>
            <span className="font-Forum">Days</span>
          </div>
          <div>
            <Court>{timeLeft.hours}</Court>
            <span className="font-Forum">Hr</span>
          </div>
          <div>
            <Court>{timeLeft.minutes}</Court>
            <span className="font-Forum">Mins</span>
          </div>
          <div>
            <Court>{timeLeft.seconds}</Court>
            <span className="font-Forum">Sec</span>
          </div>
        </div>
      </div>
    </div>
  );
};
