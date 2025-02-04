import { Button } from '@mui/material'
import { MainContent } from '../MainLayout'
import ModalContainer from '../modals/ModalContainer'
import { useState } from 'react';
import IncomeForm from '../modals/forms/IncomeForms';
import ExpenseForm from '../modals/forms/ExpenseForm';

function WalletPage() {
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [openExpenseForm, setOpenExpenseForm] = useState(false);

  return (
    <>
      <ModalContainer open={openIncomeForm}>
        <IncomeForm whenIconCloseFire={() => setOpenIncomeForm(false)} />
      </ModalContainer>
      <ModalContainer open={openExpenseForm}>
        <ExpenseForm whenIconCloseFire={() => setOpenExpenseForm(false)} />
      </ModalContainer>
      <MainContent>
        <Button onClick={() => setOpenIncomeForm(true)}>
          Add Income
        </Button>
        <Button onClick={() => setOpenExpenseForm(true)}>
          Add Expense
        </Button>
      </MainContent>
    </>
  )
}

export default WalletPage