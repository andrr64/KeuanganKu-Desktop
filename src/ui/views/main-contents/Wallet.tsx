import { Button, useMediaQuery, Box, Stack, Typography } from '@mui/material';
import { MainContent } from '../MainLayout';
import ModalContainer from '../modals/ModalContainer';
import { useState, useEffect } from 'react';
import IncomeForm from '../forms/IncomeForms';
import ExpenseForm from '../forms/ExpenseForm';
import WalletForm from '../forms/WalletForm'; // Import WalletForm
import { WalletInterface } from '../../interfaces/wallet';
import WalletCard from '../components/WalletCard';
import AddIcon from '@mui/icons-material/Add'; // Import icon untuk tombol
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Import icon untuk income
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; // Import icon untuk expense

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false); // State for WalletForm
  const [wallets, setWallets] = useState<WalletInterface[]>([]); // State for wallets

  // Cek ukuran layar
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    async function fetchWallets() {
      const response = await window.db_wallets.getWallets();
      if (response.success) {
        setWallets(response.data);
      }
    }
    fetchWallets();
  }, []);

  return (
    <>
      <ModalContainer open={openIncomeForm}>
        <IncomeForm whenIconCloseFire={() => setOpenIncomeForm(false)} />
      </ModalContainer>
      <ModalContainer open={openExpenseForm}>
        <ExpenseForm whenIconCloseFire={() => setOpenExpenseForm(false)} />
      </ModalContainer>
      <ModalContainer open={openWalletForm}> {/* Modal for WalletForm */}
        <WalletForm whenIconCloseFire={() => setOpenWalletForm(false)} />
      </ModalContainer>
      <MainContent sx={{backgroundColor:'inherit'}}>
        {/* Tombol dengan tata letak responsif */}
        <Box sx={{ marginBottom: '24px' }}>
          <Stack
            direction={isSmallScreen ? 'column' : 'row'} // Tumpuk vertikal pada layar kecil
            spacing={2} // Jarak antara tombol
          >
            <Button
              variant="contained"
              startIcon={<AttachMoneyIcon />} // Ikon untuk income
              onClick={() => setOpenIncomeForm(true)}
              sx={{
                backgroundColor: '#4caf50', // Warna hijau
                '&:hover': {
                  backgroundColor: '#388e3c', // Warna hijau lebih gelap saat hover
                },
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none', // Menghilangkan uppercase
                fontSize: '16px',
                width: isSmallScreen ? '100%' : 'auto', // Lebar penuh pada layar kecil
              }}
            >
              Add Income
            </Button>
            <Button
              variant="contained"
              startIcon={<MoneyOffIcon />} // Ikon untuk expense
              onClick={() => setOpenExpenseForm(true)}
              sx={{
                backgroundColor: '#f44336', // Warna merah
                '&:hover': {
                  backgroundColor: '#d32f2f', // Warna merah lebih gelap saat hover
                },
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none', // Menghilangkan uppercase
                fontSize: '16px',
                width: isSmallScreen ? '100%' : 'auto', // Lebar penuh pada layar kecil
              }}
            >
              Add Expense
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />} // Ikon untuk wallet
              onClick={() => setOpenWalletForm(true)}
              sx={{
                backgroundColor: '#2196f3', // Warna biru
                '&:hover': {
                  backgroundColor: '#1976d2', // Warna biru lebih gelap saat hover
                },
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none', // Menghilangkan uppercase
                fontSize: '16px',
                width: isSmallScreen ? '100%' : 'auto', // Lebar penuh pada layar kecil
              }}
            >
              Add Wallet
            </Button>
          </Stack>
        </Box>

        {/* Daftar WalletCard */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
            gap: '16px', // Jarak antara card
          }}
        >
          <Typography variant='h5' fontWeight={'semibold'}>
            Wallets
          </Typography>
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </Box>
      </MainContent>
    </>
  );
}

export default WalletPage;