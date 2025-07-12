import React from "react";

const DashboardPage = () => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      {userEmail && <p>You are logged in as <strong>{userEmail}</strong></p>}
    </div>
  );
};

export default DashboardPage;
