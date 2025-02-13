import { Box, Button, Divider, Typography } from '@mui/material';
import WalletCard from '../../../../components/WalletCard';
import React from 'react';
import { formatCurrency } from '../../../../util/number_formater';
import { WalletInterface } from '../../../../../interfaces/entities/wallet';
import CustomDropdown from '../../../../components/Dropdown';
import { EnumSortWalletsBy, sortWalletsByDropdownItems } from '../../../../../enums/sort_wallets';
import { AddCircleOutline } from '@mui/icons-material';

interface WXListWalletProps {
  openIncomeForm: (open: boolean) => void;
  openWalletForm: (open: boolean) => void;
  openExpenseForm: (open: boolean) => void;
  setActiveWallet: (index: number) => void;
  wallets: WalletInterface[];
  activeWalletIndex: number | null;
  totalBalance: number | null;
  sortWalletValue: EnumSortWalletsBy;
  setSortValue: (value: EnumSortWalletsBy) => void;
  handleDelete: (wallet: WalletInterface) => void;
  handleEdit: (wallet: WalletInterface) => void;
}

const WXListWallet: React.FC<WXListWalletProps> = ({
  openIncomeForm,
  openExpenseForm,
  openWalletForm,
  activeWalletIndex,
  wallets,
  setActiveWallet,
  totalBalance,
  sortWalletValue,
  setSortValue,
  handleDelete,
  handleEdit
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color='text.primary'>
          Wallets
        </Typography>
        <Typography variant="h6">
          {totalBalance !== null && formatCurrency(totalBalance)}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <Button
          onClick={() => openIncomeForm(true)}
          startIcon={<AddCircleOutline />}
          sx={{ fontSize: '12px', bgcolor: '#3A976C', color: 'white' }}
        >
          Income
        </Button>
        <Button
          onClick={() => openExpenseForm(true)}
          startIcon={<AddCircleOutline />}
          sx={{ fontSize: '12px', bgcolor: '#9C3436', color: 'white' }}
        >
          Expense
        </Button>
        <Button
          onClick={() => openWalletForm(true)}
          startIcon={<AddCircleOutline />}
          sx={{ fontSize: '12px', bgcolor: '#1B4272', color: 'white' }}
        >
          Wallet
        </Button>
      </Box>
      <Divider />
      <Typography variant={'body1'} fontWeight={600}>Sort Wallets</Typography>
      <CustomDropdown items={sortWalletsByDropdownItems} value={sortWalletValue} onChange={setSortValue} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {wallets.map((wallet, index) => (
          <WalletCard
            key={wallet.id}
            active={index === activeWalletIndex}
            onClick={() => setActiveWallet(index)}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            wallet={wallet}
          />
        ))}
      </Box>
    </Box>
  );
}

export default WXListWallet;