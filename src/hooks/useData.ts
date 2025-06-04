import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownReturn = {
  timeLeft: TimeLeft;
  formatted: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  isExpired: boolean;
};

export const useCountdownTimer = ({
  endDate,
}: {
  endDate: Date | string;
}): CountdownReturn => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const isExpired = Object.values(timeLeft).every((value) => value === 0);

  return {
    timeLeft,
    formatted: {
      days: formatNumber(timeLeft.days),
      hours: formatNumber(timeLeft.hours),
      minutes: formatNumber(timeLeft.minutes),
      seconds: formatNumber(timeLeft.seconds),
    },
    isExpired,
  };
};

export default useCountdownTimer;
