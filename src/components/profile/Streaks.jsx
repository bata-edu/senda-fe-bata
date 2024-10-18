import React from "react";
import { useSelector } from "react-redux";
import "../../styles/profile.css";

const Streaks = () => {
  const { user } = useSelector((state) => state.user || {});

  return (
    <div className="streaks-container">
      {user && (
        <div>
          <hr />
          <div className="streak">
            <span className="fire-streak">💎 {user.points}</span>
          </div>
          <div className="streak">
            <span className="diamond-streak">💎 {user.points}</span>
          </div>
          <div className="streak">
            <span className="golden-streak">💎 {user.points}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Streaks;
