import { Button } from '@mui/material'
import { MainContent } from '../MainLayout'
import ModalContainer from '../modals/ModalContainer'
import { useState } from 'react';
import IncomeForm from '../modals/forms/IncomeForms';
import ExpenseForm from '../modals/forms/ExpenseForm';
import WalletForm from '../modals/forms/WalletForm'; // Import WalletForm

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openWalletForm, setOpenWalletForm] = useState(false); // State for WalletForm

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
      <MainContent>
        <Button onClick={() => setOpenIncomeForm(true)}>
          Add Income
        </Button>
        <Button onClick={() => setOpenExpenseForm(true)}>
          Add Expense
        </Button>
        <Button onClick={() => setOpenWalletForm(true)}> {/* Button to open WalletForm */}
          Add Wallet
        </Button>
      </MainContent>
    </>
  )
}

export default WalletPage