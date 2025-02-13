import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { ExpenseInterface } from "../../interfaces/entities/expense";
import { formatDate } from "../util/date_formater";
import { formatCurrency } from "../util/number_formater";
import { MoreVert } from "@mui/icons-material";

interface IncomeCardProps {
  data: ExpenseInterface;
}

const IncomeCard: React.FC<IncomeCardProps> = ({ data }) => {
  const cardStyle = {
    width: '100%',
    borderRadius: '5px',
    backgroundColor: "#CFF9E0",
    boxShadow: 'none',
    color: '#3C664C',
    padding: 1.5,
    cursor: 'pointer',
    border: "1px solid #ACD2BB",
    display: 'flex',
    justifyContent: 'space-between',
    transition: "background-color 0.15s ease-in-out, color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: "#A0D7B6",
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
        <MoreVert />
      </IconButton>
    </Box>
  )
}

export default IncomeCard;