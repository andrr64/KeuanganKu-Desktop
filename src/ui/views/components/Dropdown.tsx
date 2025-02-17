import React from "react";
import {MenuItem, Select, Typography } from "@mui/material";

export interface DropdownItemInterface<T> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T> {
  items: DropdownItemInterface<T>[];
  value: T;
  onChange: (value: T) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps<any>> = ({ value, items, onChange }) => {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      sx={{
        height: 32,
        background: "#EDF4FF",
        border: "1px solid #C2DBFF",
        fontSize: 12,
        fontFamily: "Inter",
        fontWeight: 500,
        color: "#3D5776",
        width: '100%',
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
      {items.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          <Typography fontSize={12}>
            {item.label}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomDropdown;
