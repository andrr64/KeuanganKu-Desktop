import { Box, Paper, Typography } from "@mui/material"
import { MainContent } from "../../MainLayout"

function Homepage() {
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