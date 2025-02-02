import { Container, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function App() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Hello, World! 🌍
      </Typography>
      <Button variant="contained" startIcon={<HomeIcon />}>
        Go Home
      </Button>
    </Container>
  );
}
