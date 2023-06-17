import Layout from "@/components/Layout";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingPage() {
  const [products, setProducts] = useState([]);
  const [featureProduct, setFeatureProduct] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  async function handleFeatureSaveOnClick() {
    await axios.put("/api/setting", {
      name: "featureProductId",
      value: featureProduct,
    });
  }

  async function handleShippingFeeSaveOnClick() {
    await axios.put("/api/setting", {
      name: "shippingFee",
      value: shippingFee,
    });
  }

  useEffect((res) => {
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });
    axios.get("/api/setting?name=featureProductId").then((res) => {
      setFeatureProduct(res.data.value);
    });
    axios.get("/api/setting?name=shippingFee").then((res) => {
      setShippingFee(res.data.value);
    });
  }, []);

  return (
    <Layout>
      <div className={"flex justify-center"}>
        <div className={"flex flex-col max-w-lg"}>
          <h1>Settings</h1>
          <h2>Set a feature product</h2>
          <div className={"flex gap-2 py-2"}>
            <div>
              <FormControl size="small">
                <InputLabel id="select-feature-product">
                  Feature Product
                </InputLabel>
                <Select
                  id="select-feature-product"
                  size={"small"}
                  sx={{ width: "50ch" }}
                  label="Feature Product"
                  value={featureProduct}
                  onChange={(ev) => setFeatureProduct(ev.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {products.length > 0 &&
                    products.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <Button variant="contained" onClick={handleFeatureSaveOnClick}>
              Save
            </Button>
          </div>
          <h2>Set shipping fee</h2>
          <div className={"flex gap-2 pb-2"}>
            <TextField
              placeholder={"In USD$"}
              sx={{ width: "50ch" }}
              value={shippingFee}
              size={"small"}
              type={"number"}
              onChange={(ev) => setShippingFee(ev.target.value)}
            />

            <Button variant="contained" onClick={handleShippingFeeSaveOnClick}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
