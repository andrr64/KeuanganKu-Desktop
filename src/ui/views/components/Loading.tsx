import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'inherit',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;