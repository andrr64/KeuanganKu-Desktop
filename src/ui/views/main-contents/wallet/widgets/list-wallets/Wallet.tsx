import { Box, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import CustomDropdown from '../../../../components/Dropdown'
import WalletCard from '../../../../components/WalletCard'
import { WalletInterface } from '../../../../../interfaces/wallet';
import React from 'react';
import AddIcon from '@mui/icons-material/Add'
import { formatCurrency } from '../../../../util/number_formater';
import { More } from '@mui/icons-material';
import { useAlert } from '../../../../alert/AlertContext';

interface WXListWalletProps {
  openIncomeForm: (arg0: boolean) => void;
  openWalletForm: (arg0: boolean) => void;
  openExpenseForm: (arg0: boolean) => void;
  setActiveWallet: (arg0: number) => void;
  wallets: WalletInterface[];
  activeWallet: number;
  totalBalance: number | null;
}

const WXListWallet: React.FC<WXListWalletProps> = ({ openIncomeForm, openExpenseForm, openWalletForm, activeWallet, wallets, setActiveWallet, totalBalance }) => {

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
        <Typography variant="h5">
          {totalBalance !== null && (
            formatCurrency(totalBalance)
          )}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr 1fr' }}>
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
      <CustomDropdown />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {wallets.map((wallet, index) => (
          <WalletCard
            active={index == activeWallet}
            onClick={() => setActiveWallet(index)}
            handleEdit={(wallet) => { }}
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