import * as React from "react";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutlineOutlined, ModeEditOutlined } from "@mui/icons-material";
import DeleteDialog from "@/components/DeleteDialog";
import CategorySelect from "@/components/CategorySelect";

export default function CategoriesForm() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // add properties
  const [properties, setProperties] = useState([]);
  const addProperty = () => {
    setProperties((prevState) => {
      return [...prevState, { name: "", values: "" }];
    });
  };
  const removeProperty = (idx) => {
    setProperties((prevState) => {
      return [...prevState].filter((p, pidx) => {
        return pidx !== idx;
      });
    });
  };

  const handlePropertyNameChange = (idx, property, newName) => {
    setProperties((prevState) => {
      const properties = [...prevState];
      properties[idx].name = newName;
      return properties;
    });
  };

  function handlePropertyValuesChange(idx, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[idx].values = newValues;
      return properties;
    });
  }

  const onCategoryChange = (event) => setParentCategory(event.target.value);
  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setDeleteConfirmationOpen(true);
  };
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`/api/categories/?id=${deleteCategoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.id !== deleteCategoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteConfirmationOpen(false);
      setDeleteCategoryId(null);
    }
  };
  const handleEditClick = (row) => {
    setEditingCategory(row);
    setName(row.name);
    setParentCategory(row.parentId);
    setProperties(
      row.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };
  const ActionsButtons = (params) => {
    return (
      <div className={"flex gap-1"}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          <ModeEditOutlined sx={{ fontSize: 20 }} />
          Edit
        </Button>
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
    // { field: "id", headerName: "ID" , width: 10},
    { field: "name", headerName: "Name", width: 90 },
    { field: "parent", headerName: "Parent", width: 90 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: ActionsButtons,
    },
  ];

  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      const cates = res.data.map((cate) => ({
        ...cate,
        id: cate._id,
        parentId: cate.parent?._id,
        parent: cate.parent?.name,
      }));
      setCategories(cates);
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  const saveCategory = async (ev) => {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (!parentCategory) {
      delete data.parentCategory; // Remove the parentCategory property if it's not provided
    }
    if (editingCategory) {
      await axios.put("/api/categories", { ...data, _id: editingCategory._id });
      setEditingCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };

  return (
    <div className={"flex justify-center"}>
      <div className={"flex flex-col"}>
        <h1>
          {editingCategory
            ? `Editing Category ${editingCategory.name}`
            : "Add Categories"}
        </h1>
        <div className={"flex my-1"}>
          <TextField
            placeholder={"new category name"}
            sx={{ width: "50ch", paddingRight: "1rem" }}
            value={name}
            size={"small"}
            onChange={(e) => setName(e.target.value)}
          />
          <CategorySelect
            data={categories}
            onChange={onCategoryChange}
            parentCategory={parentCategory}
          />
        </div>
        {/*Add New Property*/}
        <Button
          variant="outlined"
          onClick={addProperty}
          sx={{ marginY: "0.5rem" }}
        >
          Add New Property
        </Button>
        {properties.length > 0 &&
          properties.map((property, idx) => (
            <div key={idx} className="flex gap-1 mb-2 flex-row my-0.5">
              <TextField
                size={"small"}
                value={property.name}
                placeholder={"Property Name"}
                onChange={(ev) =>
                  handlePropertyNameChange(idx, property, ev.target.value)
                }
              ></TextField>
              <TextField
                size={"small"}
                value={property.values}
                sx={{ width: "100%" }}
                placeholder={"Value Separate by Comma"}
                onChange={(ev) =>
                  handlePropertyValuesChange(idx, property, ev.target.value)
                }
              ></TextField>
              <Button variant="outlined" onClick={() => removeProperty(idx)}>
                Remove
              </Button>
            </div>
          ))}
        {/*Save Button*/}
        <Button
          variant="contained"
          onClick={saveCategory}
          sx={{ marginY: "0.5rem" }}
        >
          Save
        </Button>
        <h1 className={"py-2"}>All Categories</h1>
        <DataGrid
          rows={categories}
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
          type="category"
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={handleDeleteConfirmation}
        />
      </div>
    </div>
  );
}
