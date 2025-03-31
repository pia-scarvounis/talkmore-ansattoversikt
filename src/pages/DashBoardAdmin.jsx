import React from "react";
import NavAdmin from "../components/navigation/NavAdmin";

const DashBoardAdmin = () => {
  return (
    <div style={{ display: "flex" }}>
      <NavAdmin />

      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h1>Admin Dashboard</h1>
        {/* Her kommer resten*/}
      </div>
    </div>
  );
};

export default DashBoardAdmin;
