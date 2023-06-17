import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as React from "react";

export default function CategorySelect({ data, onChange, parentCategory }) {
  return (
    <FormControl size="small">
      <InputLabel id="select-parent-category">
        Parent Category
      </InputLabel>
      <Select
        id="select-parent-category"
        value={parentCategory}
        size={"small"}
        sx={{ minWidth: 200, width: "100%"}}
        label="Parent Category"
        onChange={onChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {data.length > 0 &&
          data.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
