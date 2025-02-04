import React from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';

interface LoadingModalProps {
  open: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ open }) => {
  return (
    <Modal open={open} onClose={() => {}} aria-labelledby="loading-modal" aria-describedby="loading-modal-description">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 3,
          borderRadius: 2,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    </Modal>
  );
};

export default LoadingModal;
