import React from "react";
import { WalletInterface } from "../../interfaces/wallet";
import { formatCurrency } from "../util/number_formater";
import { Box, Card, CardContent, IconButton, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type WalletCardProps = {
  wallet: WalletInterface;
  onClick: () => void;
  active: boolean
};
const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClick: eventOnClick, active }) => {
  const activeBgColor = '#1B4272';

  const StyledCard = styled(Card)(({}) => ({
    width: '100%',
    height: 70,
    position: "relative",
    borderRadius: 5,
    backgroundColor: active ? activeBgColor : "#EDF4FF",
    boxShadow: 'none',
    color: active? 'white' : '#2B4A75',
    cursor: 'pointer',
    border: "1px solid #C2DBFF",
    transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: active ? activeBgColor : "#BACFEE",
    },
  }));

  return (
    <StyledCard onClick={eventOnClick}>
      <CardContent
        sx={{
          position: "relative",
          padding: 0,
          color: "inherit",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 67,
            top: 17,
            fontSize: 14,
            fontWeight: "700",
            wordWrap: "break-word",
            color: "inherit", // Mengikuti warna dari CardContent
          }}
        >
          {wallet.name}
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: 67,
            top: 35,
            fontSize: 12,
            fontWeight: "400",
            wordWrap: "break-word",
            color: "inherit", // Mengikuti warna dari CardContent
          }}
        >
          {formatCurrency(wallet.balance)}
        </Box>
        <div data-svg-wrapper style={{ left: 14, top: 11, position: "absolute" }}>
          <svg
            width="49"
            height="48"
            viewBox="0 0 49 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2018_50)">
              <path
                d="M36.5 8H12.5C8.08 8 4.5 11.58 4.5 16V32C4.5 36.42 8.08 40 12.5 40H36.5C40.92 40 44.5 36.42 44.5 32V16C44.5 11.58 40.92 8 36.5 8ZM32.78 27.54C32.3 27.94 31.64 28.1 31.02 27.94L8.8 22.5C9.4 21.04 10.82 20 12.5 20H36.5C37.84 20 39.02 20.68 39.76 21.68L32.78 27.54ZM12.5 12H36.5C38.7 12 40.5 13.8 40.5 16V17.1C39.32 16.42 37.96 16 36.5 16H12.5C11.04 16 9.68 16.42 8.5 17.1V16C8.5 13.8 10.3 12 12.5 12Z"
                fill="currentColor" // Menggunakan currentColor agar ikut berubah warna
              />
            </g>
            <defs>
              <clipPath id="clip0_2018_50">
                <rect width="48" height="48" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div data-svg-wrapper style={{ right: 14, top: 11, position: "absolute" }}>
          <IconButton sx={{color: 'inherit'}} size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </CardContent>
    </StyledCard>
  );
};

export default WalletCard;