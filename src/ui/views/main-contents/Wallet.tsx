import { Button, useMediaQuery, Box, Stack, Typography, Divider } from '@mui/material';
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
import CustomDropdown from '../components/Dropdown';



function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false); // State for WalletForm
  const [wallets, setWallets] = useState<WalletInterface[]>([]); // State for wallets
  const [activeWallet, setActiveWallet] = useState<number>(0);

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
      <MainContent sx={{ backgroundColor: 'inherit' }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "3fr auto  7fr", // 5/12 & 7/12
            gap: "16px",
            width: "100%",
            minHeight: '100vh'
          }}
        >
          {/* Wallets List (5/12) */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <Typography variant="h4" fontWeight="bold">
              Wallets
            </Typography>
            <CustomDropdown/>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
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

          <Divider sx={{bgcolor: '#E8F2FF'}} orientation="vertical" flexItem />

          {/* Second Column (7/12) */}
          <Box>
            <Typography sx={{color: 'inherit'}} variant="h4" fontWeight="bold">
              Summary
            </Typography>
            {/* Tambahin konten di sini */}
          </Box>
        </Box>
      </MainContent>
    </>
  );
}

export default WalletPage;