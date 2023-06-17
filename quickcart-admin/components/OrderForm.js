import axios from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";

const PaymentStatusCell = ({ value }) => {
  const isPaid = value === "Yes";
  return (
    <div
      style={{
        fontWeight: isPaid ? "bold" : "normal",
        color: isPaid ? "green" : "red",
      }}
    >
      {value}
    </div>
  );
};
export default function OrderForm() {
  const [orders, setOrders] = useState([]);

  const columns = [
    { field: "orderTime", headerName: "OrderTime", width: 120 },
    { field: "recipient", headerName: "Recipient", width: 90 },
    { field: "email", headerName: "Email", width: 160 },
    { field: "address", headerName: "Address", width: 160 },
    { field: "products", headerName: "Products", width: 160 },
    {
      field: "payment",
      headerName: "Payment",
      width: 90,
      renderCell: (params) => <PaymentStatusCell value={params.value} />,
    },
  ];

  function fetchOrders() {
    axios.get("/api/orders").then((res) => {
      const orders = res.data.map((order) => ({
        id: order._id,
        recipient: order.name,
        email: order.email,
        address:
          order.streetAddress +
          " " +
          order.city +
          " " +
          order.postalCode +
          " " +
          order.country,
        products: order.line_items.map(
          (item) => ` ${item.price_data?.product_data.name} x ${item.quantity}`
        ),
        orderTime: new Date(order.createdAt).toLocaleString(),
        payment: order.paid ? "Yes" : "No",
      }));
      setOrders(orders);
    });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={"flex justify-center"}>
      <DataGrid
        rows={orders}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        getRowHeight={() => "auto"}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}
