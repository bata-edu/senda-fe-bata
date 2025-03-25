import React from "react";
import { useSelector } from "react-redux";
import Diamond from "../../assets/icons/diamond.svg";
import Heart from "../../assets/icons/heart.svg";
import Streak from "../../assets/icons/streak.svg";
import { Button } from "../common/button/button";

const Streaks = () => {
  const { user } = useSelector((state) => state.user || {});

  return (
    <div className="w-full max-w-4xl mx-auto">
      {user && (
        <>
          <hr className="my-4" />
          <div className="flex justify-between gap-4">
            <div className="flex-1 border rounded-xl p-6 text-center shadow-sm">
              <img
                src={Diamond}
                alt="Puntos"
                className="w-6 h-6 mx-auto mb-2"
              />
              <p className="text-lg font-semibold">{user.points} puntos</p>
            </div>

            <div className="flex-1 border rounded-xl p-6 text-center shadow-sm">
              <img src={Heart} alt="Puntos" className="w-6 h-6 mx-auto mb-2" />{" "}
              <p className="text-lg font-semibold">{user.lives} vidas</p>
            </div>

            <div className="flex-1 border rounded-xl p-6 text-center shadow-sm">
              <img src={Streak} alt="Puntos" className="w-6 h-6 mx-auto mb-2" />{" "}
              <p className="text-lg font-semibold">{user.streak} rachas</p>
            </div>
          </div>
          <div className="mt-6 w-full flex justify-center">
            <Button full variant="darkBlue" label="Guardar cambios" />
          </div>
        </>
      )}
    </div>
  );
};

export default Streaks;
