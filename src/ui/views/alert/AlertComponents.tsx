import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    styled,
    dialogClasses,
    Typography
  } from '@mui/material';
  import { CheckCircle, Error, Warning, HelpOutline } from '@mui/icons-material';
import { AlertType } from './AlertContext';
  
  
  const ModernDialog = styled(Dialog)(({ theme }) => ({
    [`& .${dialogClasses.paper}`]: {
      borderRadius: 16,
      padding: theme.spacing(2),
      boxShadow: theme.shadows[10],
    },
  }));
  
  interface AlertComponentProps {
    open: boolean;
    type: AlertType | null;
    title: string;
    description: string;
    message: string;
    onClose: () => void;
    callback?: () => void;
  }
  
  const AlertComponent = ({
    open,
    type,
    title,
    description,
    message,
    onClose,
    callback
  }: AlertComponentProps) => {
    const getConfig = () => {
      switch (type) {
        case 'success':
          return { icon: <CheckCircle fontSize="large" color="success" />, color: '#4caf50' };
        case 'error':
          return { icon: <Error fontSize="large" color="error" />, color: '#f44336' };
        case 'warning':
          return { icon: <Warning fontSize="large" color="warning" />, color: '#ff9800' };
        case 'question':
          return { icon: <HelpOutline fontSize="large" color="info" />, color: '#2196f3' };
        default:
          return { icon: null, color: '' };
      }
    };
  
    const { icon, color } = getConfig();
  
    return (
      <ModernDialog
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            transitionDuration: 300,
            sx: {
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          paper: {
            sx: {
              borderTop: `4px solid ${color}`,
              borderRadius: '16px',
              padding: 2,
              boxShadow: 10,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97))',
              transition: 'all 0.3s ease'
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pr: 8, // Memberikan padding right agar judul tidak terlalu dekat dengan close button
            position: 'relative' // Diperlukan untuk absolute positioning close button
          }}
        >
          {icon}
          <Typography variant="h6" fontWeight="600">
            {type === 'question' ? title : type?.toUpperCase()}
          </Typography>
        </DialogTitle>
  
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            {type === 'question' ? description : message}
          </Typography>
        </DialogContent>
  
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              onClose();
              if (callback){
                callback();
              }
            }}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: color,
              borderRadius: '8px',
              py: 1,
              '&:hover': { bgcolor: color },
            }}
          >
            Ok
          </Button>
          {type == 'question' && (
            <Button
              onClick={onClose}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "red",
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </ModernDialog>
    );
  };
  
  export default AlertComponent;