import { Box, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material"
import { MainContent } from "../../MainLayout"
import React from "react";
import { MoreVert, MoreVertOutlined } from "@mui/icons-material";

function Homepage() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <MainContent sx={{backgroundColor: 'inherit'}}>
            <Typography variant="h4" gutterBottom>
                Selamat Datang di Halaman Beranda
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Kartu 1 */}
                <Box sx={{ flexBasis: '100%', sm: '48%', md: '32%' }}>
                    <Paper sx={{ p: 2, '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="h6">Kartu 1</Typography>
                        <Typography variant="body1">
                            Ini adalah contoh kartu dengan efek hover.
                        </Typography>
                    </Paper>
                </Box>

                {/* Kartu 2 */}
                <Box sx={{ flexBasis: '100%', sm: '48%', md: '32%' }}>
                    <Paper sx={{ p: 2, '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="h6">Kartu 2</Typography>
                        <Typography variant="body1">
                            Kartu ini juga memiliki efek hover yang modern.
                        </Typography>
                    </Paper>
                    <IconButton onClick={handleClick}>
                        <MoreVertOutlined/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Menu 1</MenuItem>
                        <MenuItem onClick={handleClose}>Menu 2</MenuItem>
                        <MenuItem onClick={handleClose}>Menu 3</MenuItem>
                    </Menu>
                </Box>

                {/* Kartu 3 */}
                <Box sx={{ flexBasis: '100%', sm: '48%', md: '32%' }}>
                    <Paper sx={{ p: 2, '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="h6">Kartu 3</Typography>
                        <Typography variant="body1">
                            Tambahkan lebih banyak konten di sini.
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </MainContent>
    )
}

export default Homepage