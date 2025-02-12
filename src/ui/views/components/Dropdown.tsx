import React, { useState } from "react";
import { MenuItem, Select } from "@mui/material";

const CustomDropdown: React.FC = () => {
  const [value, setValue] = useState("Most Valuable");

  return (
    <Select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      displayEmpty
      sx={{
        height: 32,
        background: "#EDF4FF",
        border: "1px solid #C2DBFF",
        fontSize: 12,
        fontFamily: "Inter",
        fontWeight: 500,
        color: "#3D5776",
        ".MuiOutlinedInput-notchedOutline": { border: "none" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #C2DBFF",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #C2DBFF",
        },
        "& .MuiSelect-icon": { color: "#3D5776", fontSize: 15 }, // Icon dropdown
        paddingY: "6px",
      }}
    >
      <MenuItem value="Most Valuable">Most Valuable</MenuItem>
      <MenuItem value="Least Valuable">Least Valuable</MenuItem>
      <MenuItem value="Recently Added">Recently Added</MenuItem>
    </Select>
  );
};

export default CustomDropdown;
