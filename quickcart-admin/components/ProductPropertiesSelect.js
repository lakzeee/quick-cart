import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
export default function ProductPropertiesSelect({ properties, handleChange }) {
  return (
    <>
      {properties.length > 0 &&
        properties.map((p) => (
          <div key={p.name}>
            <FormControl sx={{ width: 200, marginY: 0.5 }} size="small">
              <InputLabel>{p.name}</InputLabel>
              <Select label={p.name} value={p.value} onChange={handleChange}>
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
    </>
  );
}
