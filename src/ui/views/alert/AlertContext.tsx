// AlertContext.tsx
import React, { createContext, useContext, useState } from 'react';
import AlertComponent from './AlertComponents';

export type AlertType = 'success' | 'error' | 'warning' | 'question';

interface AlertContextProps {
  showAlert: (type: AlertType, message: string) => void;
  showQuestion: (title: string, description: string, callback: () => void) => void;
}

interface AlertState {
  open: boolean;
  type: AlertType | null;
  title: string;
  description: string;
  message: string;
  callback?: () => void;
}

const AlertContext = createContext<AlertContextProps>({} as AlertContextProps);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AlertState>({
    open: false,
    type: null,
    title: '',
    description: '',
    message: '',
  });

  const showAlert = (type: AlertType, message: string) => {
    setState({
      open: true,
      type,
      message,
      title: '',
      description: ''
    });
  };

  const showQuestion = (title: string, description: string, callback: () => void) => {
    setState({
      open: true,
      type: 'question',
      title,
      description,
      message: '',
      callback
    });
  };

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, showQuestion }}>
      {children}
      <AlertComponent
        open={state.open}
        type={state.type}
        title={state.title}
        description={state.description}
        message={state.message}
        callback={state.callback}
        onClose={handleClose}
      />
    </AlertContext.Provider>
  );
};


export const useAlert = () => {
  return useContext(AlertContext);
};