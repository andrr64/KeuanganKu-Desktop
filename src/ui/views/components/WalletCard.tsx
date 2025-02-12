import React from "react";
import { WalletInterface } from "../../interfaces/wallet";
import { formatCurrency } from "../util/number_formater";
import { Box, Card, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type WalletCardProps = {
  wallet: WalletInterface;
  onClick: () => void;
  handleEdit: (wallet: WalletInterface) => void;
  handleDelete: (wallet: WalletInterface) => void;
  active: boolean;
};

const WalletCard: React.FC<WalletCardProps> = ({ wallet, handleDelete, handleEdit, onClick: eventOnClick, active }) => {
  const activeBgColor = '#1B4272';

  const cardStyle = {
    width: '100%',
    borderRadius: '5px',
    backgroundColor: active ? activeBgColor : "#EDF4FF",
    boxShadow: 'none',
    color: active ? 'white' : '#2B4A75',
    cursor: 'pointer',
    border: "1px solid #C2DBFF",
    transition: "background-color 0.3s ease-in-out, color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: active ? activeBgColor : "#BACFEE",
    },
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Mencegah event onClick Card terpanggil
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Mencegah event onClick Card terpanggil
    setAnchorEl(null);
  };

  return (
    <Card sx={cardStyle} onClick={eventOnClick}>
      <Box
        sx={{
          display: "flex",
          color: "inherit",
          padding: 2,
          gap: 2,
        }}
      >
        {/* Icon Wallet */}

        <svg
          width="40"
          height="40"
          viewBox="0 0 49 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2018_50)">
            <path
              d="M36.5 8H12.5C8.08 8 4.5 11.58 4.5 16V32C4.5 36.42 8.08 40 12.5 40H36.5C40.92 40 44.5 36.42 44.5 32V16C44.5 11.58 40.92 8 36.5 8ZM32.78 27.54C32.3 27.94 31.64 28.1 31.02 27.94L8.8 22.5C9.4 21.04 10.82 20 12.5 20H36.5C37.84 20 39.02 20.68 39.76 21.68L32.78 27.54ZM12.5 12H36.5C38.7 12 40.5 13.8 40.5 16V17.1C39.32 16.42 37.96 16 36.5 16H12.5C11.04 16 9.68 16.42 8.5 17.1V16C8.5 13.8 10.3 12 12.5 12Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_2018_50">
              <rect width="48" height="48" fill="white" transform="translate(0.5)" />
            </clipPath>
          </defs>
        </svg>

        {/* Nama dan Saldo Wallet */}
        <Box
          sx={{
            flex: 1, // Mengisi sisa ruang yang tersedia
            display: "flex",
            flexDirection: "column",
            gap: 0.5, // Jarak antara nama dan saldo
          }}
        >
          <Box
            sx={{
              fontSize: 14,
              fontWeight: "700",
              color: "inherit",
            }}
          >
            {wallet.name}
          </Box>
          <Box
            sx={{
              fontSize: 12,
              fontWeight: "400",
              color: "inherit",
            }}
          >
            {formatCurrency(wallet.balance)}
          </Box>
        </Box>

        {/* IconButton untuk Menu */}
        <Box>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              color: "inherit",
            }}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Menu */}
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem sx={{fontSize: '12px'}} onClick={(event: React.MouseEvent<HTMLElement>) => {
              handleEdit(wallet);
              handleClose(event);
            }}>
              <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
              Edit
            </MenuItem>
            <Divider/>
            <MenuItem sx={{fontSize: '12px'}} onClick={(event: React.MouseEvent<HTMLElement>) => {
              handleDelete(wallet);
              handleClose(event);
            }}>
              <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Card>
  );
};

export default WalletCard;