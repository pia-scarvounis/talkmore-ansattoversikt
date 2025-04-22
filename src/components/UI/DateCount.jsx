// denne komponenten viser dagens dato og teller antall ansatte på de ulike sidene. DateCount.jsx legges under PageHeader.jsx på profilsidene
import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const DateCount = ({ count, hideDate = false  }) => {
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const formattedDate = format(new Date(selectedDate), "EEEE d. MMMM yyyy", {
    locale: nb,
  });

  return (
    <div className="date-count">
        {!hideDate && <span className="date-text">{formattedDate}</span>}
      <span className="count-text">Totalt: {count} ansatte</span>
    </div>
  );
};

export default DateCount;
