import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MouseEventHandler } from 'react';



const ViewMenuItem = ({ onClick }: { onClick: MouseEventHandler }) => (
    <MenuItem onClick={onClick}>
        <VisibilityIcon sx={{fontSize: '16px', marginRight: '5px'}} />
        <p style={{fontSize: '12px'}}>Detail</p>
    </MenuItem>
);

const EditMenuItem = ({ onClick }: { onClick: MouseEventHandler }) => (
    <MenuItem onClick={onClick}>
        <EditIcon sx={{fontSize: '16px', marginRight: '5px'}} />
        <p style={{fontSize: '12px'}}>Edit</p>
    </MenuItem>
);

const DeleteMenuItem = ({ onClick }: { onClick: MouseEventHandler }) => (
    <MenuItem onClick={onClick}>
        <DeleteIcon sx={{fontSize: '16px', marginRight: '5px'}} />
        <p style={{fontSize: '12px'}}>Delete</p>
    </MenuItem>
);

export { ViewMenuItem, EditMenuItem, DeleteMenuItem };