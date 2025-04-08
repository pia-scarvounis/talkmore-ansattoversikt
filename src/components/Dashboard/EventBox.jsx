import React from "react";
import "../../styles/dashboard.css";
import balloonsIcon from "../../assets/icons/balloons.svg";

const EventBox = () => {
  return (
    <div className="event-box">
      <h3>
        <span className="icon-balloons">
          <img src={balloonsIcon} alt="Ballonger" />
        </span>{" "}
        BURSDAGER & JUBILEUM
      </h3>

      <div className="section-title">Bursdag i dag</div>
      <div className="entry">
        <span>Andre etternavn</span>
        <span>10.10.2025</span>
      </div>

      <div className="section-title">Jubileum i dag</div>
      <div className="entry">
        <span>Andre etternavn</span>
        <span>12.12.2025</span>
      </div>
      <div className="entry">
        <span>Andre etternavn</span>
        <span>12.12.2025</span>
      </div>
    </div>
  );
};

export default EventBox;
