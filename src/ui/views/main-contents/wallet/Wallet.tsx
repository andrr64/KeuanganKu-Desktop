import { useEffect, useState } from "react";
import { WalletInterface } from "../../../interfaces/wallet";
import { Box, Divider } from "@mui/material";
import ModalContainer from "../../modals/ModalContainer";
import IncomeForm from "../../forms/IncomeForms";
import ExpenseForm from "../../forms/ExpenseForm";
import WalletForm from "../../forms/WalletForm";
import WXWalletSummary from "./widgets/summary/WalletSummary";
import WXListWallet from "./widgets/list-wallets/Wallet";
import { MainContent } from "../../MainLayout";

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false);
  const [wallets, setWallets] = useState<WalletInterface[]>([]);
  const [activeWallet, setActiveWallet] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number | null>(0);


  const handleNewWallet = async (wallet: WalletInterface) => {
    setWallets([...wallets, wallet]);
  }

  const fetchWallets = async () => {
    const response = await window.db_wallets.getWallets();
    if (response.success) {
      setWallets(response.data);
      setTotalBalance(response.data.reduce((acc, wallet) => acc + wallet.balance, 0));
    }
  }

  useEffect(() => {
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
      <ModalContainer open={openWalletForm}>
        <WalletForm handleNewWallet={handleNewWallet} whenIconCloseFire={() => setOpenWalletForm(false)} />
      </ModalContainer>
      <MainContent sx={{ backgroundColor: 'inherit' }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "3fr auto 7fr",
            gap: "16px",
            width: "100%",
            minHeight: '100vh'
          }}
        >
          <WXListWallet
            openIncomeForm={setOpenIncomeForm}
            openExpenseForm={setOpenExpenseForm}
            openWalletForm={setOpenWalletForm}
            activeWallet={activeWallet}
            wallets={wallets}
            totalBalance={totalBalance}
            setActiveWallet={setActiveWallet}
          />
          <Divider sx={{ bgcolor: '#E8F2FF' }} orientation="vertical" flexItem />
          <WXWalletSummary wallet={wallets[activeWallet]} />
        </Box>
      </MainContent>
    </>
  );
}

export default WalletPage;