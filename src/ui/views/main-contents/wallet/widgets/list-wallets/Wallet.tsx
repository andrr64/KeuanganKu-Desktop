import { Box, Button, Typography } from '@mui/material'
import CustomDropdown from '../../../../components/Dropdown'
import WalletCard from '../../../../components/WalletCard'
import { WalletInterface } from '../../../../../interfaces/wallet';
import React from 'react';
import AddIcon from '@mui/icons-material/Add'

interface WXListWalletProps {
  openIncomeForm: (arg0: boolean) => void;
  openWalletForm: (arg0: boolean) => void;
  openExpenseForm: (arg0: boolean) => void;
  setActiveWallet: (arg0: number) => void;
  wallets: WalletInterface[];
  activeWallet: number;
}

const WXListWallet: React.FC<WXListWalletProps> = ({ openIncomeForm, openExpenseForm, openWalletForm, activeWallet, wallets, setActiveWallet }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <Typography variant="h5" fontWeight="bold">
        Wallets
      </Typography>
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
            key={wallet.id}
            wallet={wallet}
          />
        ))}
      </Box>
    </Box>
  )
}

export default WXListWallet