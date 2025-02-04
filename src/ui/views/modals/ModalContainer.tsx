import React from 'react';
import { Modal, Box } from '@mui/material';

interface ModalContainerProps {
    open: boolean;
    children: React.ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ open, children }) => {
    return (
        <Modal
            slotProps={{
                backdrop: {
                    transitionDuration: 300,
                    sx: {
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            }}
            open={open}
            onClose={(_, __) => {

            }}
            aria-labelledby="modal-container"
            aria-describedby="modal-container-description"
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {children}
            </Box>
        </Modal>
    );
};

export default ModalContainer;
