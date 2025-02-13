import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { ExpenseInterface } from "../../interfaces/entities/expense";
import { formatCurrency } from "../util/number_formater";
import { formatDate } from "../util/date_formater";
import { MoreVert } from "@mui/icons-material";

interface ExpenseCardProp {
  data: ExpenseInterface;
}

const ExpenseCard: React.FC<ExpenseCardProp> = ({ data }) => {
  const cardStyle = {
    width: '100%',
    borderRadius: '5px',
    backgroundColor: "#F9CFD0",
    boxShadow: 'none',
    color: '#7E5252',
    padding: 1.5,
    cursor: 'pointer',
    border: "1px solid #D2ACAC",
    display: 'flex',
    justifyContent: 'space-between',
    transition: "background-color 0.15s ease-in-out, color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: "#D7A0A0",
    },
  };

  return (
    <Box sx={cardStyle}>
      <Box>
        <Typography fontSize={18} fontWeight={700}>{data.title}</Typography>
        <Typography fontSize={15}>{formatCurrency(data.amount)}</Typography>
        <Typography fontSize={12}>{formatDate(data.createdAt)}</Typography>
      </Box>
      <IconButton>
        <MoreVert/>
      </IconButton>
    </Box>
  )
}

export default ExpenseCard;