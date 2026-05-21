import React, { useState } from "react";
import Dashboard from "../screens/Dashboard";
import NewOrders from "../screens/NewOrders";
import OrderDetails from "../screens/OrderDetails";

export default function AppNavigator() {

  const [screen, setScreen] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (screen === "orders") {
    return (
      <NewOrders
        goBack={() => setScreen("dashboard")}
        goDetails={(order) => {
          setSelectedOrder(order);
          setScreen("details");
        }}
      />
    );
  }

  if (screen === "details") {
    return (
      <OrderDetails
        order={selectedOrder}
        goBack={() => setScreen("orders")}
      />
    );
  }

  return (
    <Dashboard
      goOrders={() => setScreen("orders")}
    />
  );
}