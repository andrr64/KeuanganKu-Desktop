import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Toolbar,
    styled,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import { useAlert } from './alert/AlertContext';
import WalletPage from './main-contents/wallet/Wallet';

// Buat tema kustom
const theme = createTheme({
    palette: {
        primary: {
            main: '#1B4272', // Warna biru modern
        },
        secondary: {
            main: '#dc004e', // Warna aksen merah muda
        },
        background: {
            default: '#f4f6f8', // Warna latar belakang
        },
    },
});

// Styled component untuk sidebar
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 240,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
}));

export const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
}));

function MainLayout() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { showQuestion } = useAlert();
    const handleListItemClick = (index: number) => {
        setSelectedIndex(index); // Update state saat item diklik
    };
    const handleExit = async () => {
        showQuestion("Exit", "Are you sure you want to exit?", () => {
            window.app_sys.quitApp();
        })
    }
    const drawerItems = [
        {
            name: "Wallet",
            onClick: (index: number) => {
                handleListItemClick(index);
            },
            icon: <AccountBalanceWalletIcon color='inherit' />,
            content: <WalletPage />
        },
        {
            name: "Exit",
            onClick: (_: number) => {
                handleExit();
            },
            icon: <LogoutIcon color='inherit' />
        },
    ]

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <StyledDrawer variant="permanent">
                    <Toolbar />
                    <Box sx={{ overflow: 'auto', paddingX: 2.5 }}>
                        <List sx={{gap: 1, display: 'flex', flexDirection: 'column'}}>
                            {drawerItems.map((menuItem, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedIndex === index}
                                    onClick={() => {
                                        menuItem.onClick(index);
                                    }}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                            }
                                        },
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit' }}>
                                        {menuItem.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menuItem.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </StyledDrawer>
                <div style={{width: '100%', backgroundColor: '#FAFAFA'}}>
                    {drawerItems[selectedIndex].content}
                </div>
            </Box>
        </ThemeProvider>
    );
}

export default MainLayout;