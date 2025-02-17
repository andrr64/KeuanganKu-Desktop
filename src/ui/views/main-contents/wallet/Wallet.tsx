import { useCallback, useEffect, useState } from "react";
import { WalletInterface } from "../../../interfaces/entities/wallet";
import { Box, Divider } from "@mui/material";
import ModalContainer from "../../modals/ModalContainer";
import IncomeForm from "../../forms/IncomeForms";
import ExpenseForm from "../../forms/ExpenseForm";
import WalletForm from "../../forms/WalletForm";
import WXWalletSummary from "./widgets/Summary";
import WXListWallet from "./widgets/ListWallet";
import { MainContent } from "../../MainLayout";
import { EnumSortWalletsBy } from "../../../enums/sort_wallets";
import { useAlert } from "../../alert/AlertContext";
import Loading from "../../components/Loading";

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false);
  const [wallets, setWallets] = useState<WalletInterface[]>([]);
  const [activeWalletIndex, setSelectedWalletIndex] = useState<number | null>(null);
  const [sortWalletVal, setSortWalletValue] = useState<EnumSortWalletsBy>(EnumSortWalletsBy.Alphabetic_ASC);
  const {showAlert, showQuestion } = useAlert();
  const [fetched, setFetched] = useState(false);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  const handleNewWallet = useCallback((newWallet: WalletInterface) => {
    setWallets(prev => [...prev, newWallet]);
  }, []);

  const handleEdit = useCallback(async (_: WalletInterface) => {
    // Implement edit functionality
  }, []);

  const handleDelete = useCallback((wallet: WalletInterface) => {
    showQuestion('Delete Wallet', 'Are you sure you want to delete this wallet?', async () => {
      const response = await window.db_wallets.deleteWallet(wallet.id);
      if (response.success) {
        setWallets(prevWallets => prevWallets.filter(w => w.id !== wallet.id));
        showAlert('success', 'Wallet deleted successfully');
      } else {
        showAlert('error', response.message);
      }
    });
  }, [showQuestion, showAlert]);

  const fetchData = useCallback(async () => {
    const response = await window.db_wallets.getWalletsBySort(sortWalletVal);
    if (response.success) {
      const walletsData = response.data;
      setWallets(walletsData);
      setSelectedWalletIndex(walletsData.length > 0 ? 0 : null);
    }
    setFetched(true);
  }, [sortWalletVal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            setActiveWallet={setSelectedWalletIndex}
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