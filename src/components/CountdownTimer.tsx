import { ClockAlert } from "lucide-react";
import useCountdownTimer from "../hooks/useData";

export const CountdownTimer = ({ endDate }: any) => {
  const { timeLeft } = useCountdownTimer({ endDate: endDate });
  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 p-2 sm:p-3 bg-red-50 rounded-md border border-red-200">
      <div className="text-red-600 mr-1 sm:mr-2">
        <ClockAlert />
      </div>
      <div className="text-center">
        <span className="font-bold text-red-600 text-sm sm:text-base">
          {timeLeft.days}
        </span>
        <span className="text-xs text-red-500"> дн</span>
      </div>
      <span className="text-red-500 text-xs sm:text-sm">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600 text-sm sm:text-base">
          {timeLeft.hours}
        </span>
        <span className="text-xs text-red-500"> год</span>
      </div>
      <span className="text-red-500 text-xs sm:text-sm">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600 text-sm sm:text-base">
          {timeLeft.minutes}
        </span>
        <span className="text-xs text-red-500"> хв</span>
      </div>
      <span className="text-red-500 text-xs sm:text-sm">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600 text-sm sm:text-base">
          {timeLeft.seconds}
        </span>
        <span className="text-xs text-red-500"> сек</span>
      </div>
    </div>
  );
};
