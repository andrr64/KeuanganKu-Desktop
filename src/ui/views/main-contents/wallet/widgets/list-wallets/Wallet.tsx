import { Box, Button, Divider, Typography } from '@mui/material'
import WalletCard from '../../../../components/WalletCard'
import React from 'react';
import AddIcon from '@mui/icons-material/Add'
import { formatCurrency } from '../../../../util/number_formater';
import { useAlert } from '../../../../alert/AlertContext';
import { WalletInterface } from '../../../../../interfaces/entities/wallet';
import CustomDropdown from '../../../../components/Dropdown';
import { EnumSortWalletsBy, sortWalletsByDropdownItems } from '../../../../../enums/sort_wallets';

interface WXListWalletProps {
  openIncomeForm: (arg0: boolean) => void;
  openWalletForm: (arg0: boolean) => void;
  openExpenseForm: (arg0: boolean) => void;
  setActiveWallet: (arg0: number) => void;
  wallets: WalletInterface[];
  activeWallet: number;
  totalBalance: number | null;
  sortWalletValue: EnumSortWalletsBy;
  setSortValue: (arg0: EnumSortWalletsBy) => void;
}

const WXListWallet: React.FC<WXListWalletProps> = ({ openIncomeForm, openExpenseForm, openWalletForm, activeWallet, wallets, setActiveWallet, totalBalance, sortWalletValue, setSortValue }) => {

  const { showAlert, showQuestion } = useAlert();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color='text.primary'>
          Wallets
        </Typography>
        <Typography variant="h6">
          {totalBalance !== null && (
            formatCurrency(totalBalance)
          )}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <Button
          onClick={(_) => openIncomeForm(true)}
          startIcon={<AddIcon />}
          sx={{ fontSize: '12px', bgcolor: '#3A976C', color: 'white' }}
        >
          Income
        </Button>
        <Button
          onClick={(_) => openExpenseForm(true)}
          startIcon={<AddIcon />}
          sx={{ fontSize: '12px', bgcolor: '#9C3436', color: 'white' }}
        >
          Expense
        </Button>
        <Button
          onClick={(_) => openWalletForm(true)}
          startIcon={<AddIcon />}
          sx={{ fontSize: '12px', bgcolor: '#1B4272', color: 'white' }}
        >
          Wallet
        </Button>
      </Box>
      <Divider />
      <Typography variant={'body1'} fontWeight={600}>Sort Wallets</Typography>
      <CustomDropdown items={sortWalletsByDropdownItems} value={sortWalletValue} onChange={setSortValue} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {wallets.map((wallet, index) => (
          <WalletCard
            active={index == activeWallet}
            onClick={() => setActiveWallet(index)}
            handleEdit={(_) => {
              ///TODO: handleEdit
            }}
            handleDelete={(wallet) => {
              showQuestion('Delete Wallet', 'Are you sure you want to delete this wallet?', async () => {
                const response = await window.db_wallets.deleteWallet(wallet.id);
                if (response.success) {
                  showAlert('success', 'Wallet deleted successfully');
                } else {
                  showAlert('error', response.message);
                }
              });
            }}
            key={wallet.id}
            wallet={wallet}
          />
        ))}
      </Box>
    </Box>
  )
}

export default WXListWallet