import { useCallback, useEffect, useState } from "react";
import { WalletInterface } from "../../../interfaces/entities/wallet";
import { Box, Divider } from "@mui/material";
import ModalContainer from "../../modals/ModalContainer";
import IncomeForm from "../../forms/IncomeForms";
import ExpenseForm from "../../forms/ExpenseForm";
import WalletForm from "../../forms/WalletForm";
import WXListWallet from "./widgets/ListWallet";
import { MainContent } from "../../MainLayout";
import { EnumSortWalletsBy } from "../../../enums/sort_wallets";
import { useAlert } from "../../alert/AlertContext";
import Loading from "../../components/Loading";
import WalletTransactions from "./widgets/Transactions";
import Graphs from "./widgets/Graphs";
import { IncomeInterface } from "../../../interfaces/entities/income";
import { EXPENSE_TYPE, ExpenseInterface } from "../../../interfaces/entities/expense";

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false);
  const [wallets, setWallets] = useState<WalletInterface[]>([]);
  const [activeWalletIndex, setSelectedWalletIndex] = useState<number | null>(null);
  const [sortWalletVal, setSortWalletValue] = useState<EnumSortWalletsBy>(EnumSortWalletsBy.Alphabetic_ASC);
  const { showAlert, showQuestion } = useAlert();
  const [fetched, setFetched] = useState(false);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  // Fungsi untuk memperbarui wallets
  const updateWallets = useCallback(async () => {
    const response = await window.db_wallets.getWalletsBySort(sortWalletVal);
    if (response.success) {
      setWallets(response.data);
      if (response.data.length > 0 && activeWalletIndex === null) {
        setSelectedWalletIndex(0); // Set active wallet jika belum ada
      }
    }
  }, [sortWalletVal, activeWalletIndex]);

  // Fetch data awal
  useEffect(() => {
    updateWallets().then(() => setFetched(true));
  }, [updateWallets]);

  // Handle new wallet
  const handleNewWallet = useCallback((newWallet: WalletInterface) => {
    setWallets((prev) => [...prev, newWallet]);
    setSelectedWalletIndex(wallets.length); // Set active wallet ke yang baru ditambahkan
  }, [wallets.length]);

  // Handle edit wallet
  const handleEdit = useCallback(async (_: WalletInterface) => {

  }, [showAlert]);

  // Handle delete wallet
  const handleDelete = useCallback((wallet: WalletInterface) => {
    showQuestion('Delete Wallet', 'Are you sure you want to delete this wallet?', async () => {
      const response = await window.db_wallets.deleteWallet(wallet.id);
      if (response.success) {
        setWallets((prev) => prev.filter((w) => w.id !== wallet.id));
        if (wallets.length === 1) {
          setSelectedWalletIndex(null); // Reset active wallet jika tidak ada wallet lagi
        }
        showAlert('success', 'Wallet deleted successfully');
      } else {
        showAlert('error', response.message);
      }
    });
  }, [showQuestion, showAlert, wallets.length]);

  // Handle delete transaction
  const handleDeleteTransactions = useCallback((tx: IncomeInterface | ExpenseInterface) => {
    showQuestion('Delete Transaction', 'Are you sure you want to delete this transaction?', async () => {
      if (tx.type === EXPENSE_TYPE) {
        const response = await window.db_expenses.deleteExpense(tx.id);
        if (response.success) {
          showAlert('success', 'Expense deleted successfully');
          updateWallets(); // Perbarui wallets setelah menghapus transaksi
        }
      } else {
        const response = await window.db_incomes.deleteIncome(tx.id);
        if (response.success) {
          showAlert('success', 'Income deleted successfully');
          updateWallets(); // Perbarui wallets setelah menghapus transaksi
        }
      }
    });
  }, [showQuestion, showAlert, updateWallets]);

  // Handle edit transaction
  const handleEditTransactions = useCallback((_: IncomeInterface | ExpenseInterface) => {
    
  }, []);

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
        <IncomeForm whenNewDataSaved={(_) => {
          updateWallets();
        }} whenIconCloseFire={() => setOpenIncomeForm(false)} />
      </ModalContainer>
      <ModalContainer open={openExpenseForm}>
        <ExpenseForm whenNewDataSaved={(_) => {
          updateWallets();
        }} whenIconCloseFire={() => setOpenExpenseForm(false)} />
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <WalletTransactions
                wallet={wallets[activeWalletIndex]}
                handleDelete={handleDeleteTransactions}
                handleEdit={handleEditTransactions}
              />
              <Graphs wallet={wallets[activeWalletIndex]} />
            </Box>
          )}
        </Box>
      </MainContent>
    </>
  );
}

export default WalletPage;