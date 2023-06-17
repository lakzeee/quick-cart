import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import DeleteDialog from "@/components/DeleteDialog";
import { DeleteOutlineOutlined, ModeEditOutlined } from "@mui/icons-material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // Fetching Products Data
  useEffect(() => {
    axios.get("/api/products").then((res) => {
      const products = res.data.map((product) => ({
        ...product,
        id: product._id,
      }));
      setProducts(products);
    });
  }, []);

  // Buttons for Edit and Delete
  const ActionsButtons = (params) => {
    return (
      <div className={"flex gap-1"}>
        <Link href={`/products/edit/${params.row.id}`}>
          <Button variant="outlined" size="small">
            <ModeEditOutlined sx={{ fontSize: 20 }} />
            Edit
          </Button>
        </Link>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          <DeleteOutlineOutlined sx={{ fontSize: 20 }} />
          Edit
        </Button>
      </div>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 90 },
    {
      field: "description",
      headerName: "Description",
      width: 180,
    },
    { field: "price", headerName: "Price", width: 90 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: ActionsButtons,
    },
  ];

  const handleDeleteClick = (id) => {
    setDeleteProductId(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`/api/products/?id=${deleteProductId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== deleteProductId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleteConfirmationOpen(false);
      setDeleteProductId(null);
    }
  };

  return (
    <Layout>
      <div className={"flex justify-center"}>
        <div className={"flex flex-col"}><Link href={"/products/new"}>
          <Button variant="contained">Add New Product</Button>
        </Link>
          <div className={"py-4"}>
            <DataGrid
                rows={products}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
            <DeleteDialog
                type="product"
                open={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDeleteConfirmation}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
