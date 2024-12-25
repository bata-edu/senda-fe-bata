import React from "react";
import Lives from "../../../assets/icons/lives.svg";
import Streak from "../../../assets/icons/streak.svg";
import Diamond from "../../../assets/icons/diamond.svg";
import { getUser } from "../../../features/auth/authService";

const StreaksNDiamonds = ({noPadding}) => {
  const user = getUser();
  return (
    <div className={`flex items-center justify-between w-full ${noPadding ? '' : 'pl-24'}`}>
      <div className="flex items-center">
        <img src={Diamond} alt="Current Batapoints" className="h-6" />
        <span className="ml-2">{user?.points}</span>
      </div>
      <div className="flex items-center ">
        <img src={Streak} alt="Current Streak" className="h-6" />
        <span className="ml-2">{user?.streak}</span>
      </div>
      <div className="flex items-center ">
        <img src={Lives} alt="Remaining Lives" className="h-6" />
        <span className="ml-2">{user?.life}</span>
      </div>
    </div>
  );
};

export default StreaksNDiamonds;
