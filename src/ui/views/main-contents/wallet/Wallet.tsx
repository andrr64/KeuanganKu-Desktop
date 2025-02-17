import { useEffect, useState } from "react";
import { WalletInterface } from "../../../interfaces/entities/wallet";
import { Box, Divider } from "@mui/material";
import ModalContainer from "../../modals/ModalContainer";
import IncomeForm from "../../forms/IncomeForms";
import ExpenseForm from "../../forms/ExpenseForm";
import WalletForm from "../../forms/WalletForm";
import WXWalletSummary from "./widgets/summary/WalletSummary";
import WXListWallet from "./widgets/list-wallets/ListWallet";
import { MainContent } from "../../MainLayout";
import { EnumSortWalletsBy } from "../../../enums/sort_wallets";
import { useAlert } from "../../alert/AlertContext";
import Loading from "../../components/Loading";

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false);
  const [wallets, setWallets] = useState<WalletInterface[]>([]);
  const [activeWalletIndex, setActiveWallet] = useState<number | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(0);
  const [sortWalletVal, setSortWalletValue] = useState<EnumSortWalletsBy>(EnumSortWalletsBy.Alphabetic_ASC);
  const { showAlert, showQuestion } = useAlert();
  const [fetched, setFetched] = useState(false);

  const handleNewWallet = async (wallet: WalletInterface) => {
    setWallets([...wallets, wallet]);
    setTotalBalance(totalBalance?? 0 + wallet.balance);
  };

  const handleEdit = async (_: WalletInterface) => {
    // Implement edit functionality
  };

  const handleDelete = (wallet: WalletInterface) => {
    showQuestion('Delete Wallet', 'Are you sure you want to delete this wallet?', async () => {
      const response = await window.db_wallets.deleteWallet(wallet.id);
      if (response.success) {
        setWallets(prevWallets => prevWallets.filter(w => w.id !== wallet.id));
        if (wallets.length === 1) {
          setActiveWallet(0);
        } else if (wallets.length === 0) {
          setActiveWallet(null);
        }
        showAlert('success', 'Wallet deleted successfully');
      } else {
        showAlert('error', response.message);
      }
    });
  };

  const fetchData = async () => {
    const response = await window.db_wallets.getWalletsBySort(sortWalletVal);
    if (response.success) {
      setWallets(response.data);
      setActiveWallet(0);
      setTotalBalance(response.data.reduce((acc, wallet) => acc + wallet.balance, 0));
    }
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, [sortWalletVal]);

  if (!fetched) {
    return (
      <Box sx={{ height: '100vh' }}>
        <Loading />
      </Box>
    );
  }

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
            activeWalletIndex={activeWalletIndex}
            sortWalletValue={sortWalletVal}
            setSortValue={setSortWalletValue}
            wallets={wallets}
            totalBalance={totalBalance}
            setActiveWallet={setActiveWallet}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
          <Divider sx={{ bgcolor: '#E8F2FF' }} orientation="vertical" flexItem />
          {activeWalletIndex !== null && (
            <WXWalletSummary wallet={wallets[activeWalletIndex]} />
          )}
        </Box>
      </MainContent>
    </>
  );
}

export default WalletPage;