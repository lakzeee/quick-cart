import {
  Button,
  CircularProgress,
  FormControl,
  ImageList,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FileUploadOutlined } from "@mui/icons-material";
import { ReactSortable } from "react-sortablejs";
import CategorySelect from "@/components/CategorySelect";
import * as React from "react";
import ProductPropertiesSelect from "./ProductPropertiesSelect";

export default function ProductForm({
  _id,
  name: curName,
  description: curDescription,
  price: curPrice,
  images: curImages,
  category: curCategory,
    properties: curProperties
}) {
  const router = useRouter();
  const [name, setName] = useState(curName || "");
  const [description, setDescription] = useState(curDescription || "");
  const [price, setPrice] = useState(curPrice || "");
  const [gotoProduct, setGotoProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState(curImages || []);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(curCategory || "");

  // add properties to select
  const [productProperties, setProductProperties] = useState(curProperties|| {});

  function handleProductPropertiesChange(propName, value) {
    setProductProperties((prevState) => {
      const newProductProps = { ...prevState };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  const onCategoryChange = (event) => setCategory(event.target.value);

  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);

  const heading = _id ? "Edit Product" : "New Product";

  async function createProduct(event) {
    event.preventDefault();
    const data = {
      name,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
      console.log("save sussuce");
    } else {
      await axios.post("/api/products", data);
    }
    setGotoProduct(true);
  }

  if (gotoProduct) {
    router.push("/products");
  }

  async function uploadImages(event) {
    const files = event.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((curImages) => [...curImages, ...res.data.links]);
    }
    setIsUploading(false);
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form>
      <div className={"flex justify-center"}>
        <div className={"flex flex-col"}>
          <h1>{heading}</h1>
          <TextField
            size={"small"}
            placeholder={"product name"}
            sx={{ width: "50ch", paddingY: "0.5rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CategorySelect
            data={categories}
            onChange={onCategoryChange}
            parentCategory={category}
          />
          {/* Properties Selection */}
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((p) => (
              <div key={p.name}>
                <FormControl sx={{ width: 200, marginY: 0.5 }} size="small">
                  <InputLabel>{p.name}</InputLabel>
                  <Select
                    label={p.name}
                    value={productProperties[p.name]}
                    onChange={(event) =>
                      handleProductPropertiesChange(p.name, event.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {p.values.map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ))}
          {/*Product description input box*/}
          <TextField
            multiline
            rows={4}
            size={"small"}
            placeholder={"product description"}
            sx={{ width: "50ch", paddingY: "0.5rem" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className={"py-1 flex flex-wrap"}>
            <ReactSortable
              list={images}
              className={"flex flex-wrap"}
              setList={updateImagesOrder}
            >
              {!!images?.length &&
                images.map((image) => (
                  <div key={image} className={"inline-block h-24"}>
                    <img className={"rounded-lg px-1"} src={image} alt="" />
                  </div>
                ))}
            </ReactSortable>
            {isUploading && (
              <div className={"w-24 h-24 flex justify-center items-center"}>
                <CircularProgress />
              </div>
            )}
            <div>
              <input
                type="file"
                id="upload-input"
                style={{ display: "none" }}
                onChange={uploadImages}
              />
              <label htmlFor="upload-input">
                <Button
                  component="span"
                  variant="outlined"
                  sx={{ width: "6rem", height: "6rem" }}
                >
                  <FileUploadOutlined />
                  Upload
                </Button>
              </label>
            </div>
          </div>
          <TextField
            size={"small"}
            placeholder={"price"}
            sx={{ width: "50ch", paddingY: "0.5rem" }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button variant="outlined" onClick={createProduct}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
