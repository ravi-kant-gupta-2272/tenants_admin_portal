    import * as React from 'react';
    import Button from '@mui/material/Button';
    import Dialog from '@mui/material/Dialog';
    import ListItemText from '@mui/material/ListItemText';
    import ListItemButton from '@mui/material/ListItemButton';
    import List from '@mui/material/List';
    import Divider from '@mui/material/Divider';
    import AppBar from '@mui/material/AppBar';
    import Toolbar from '@mui/material/Toolbar';
    import IconButton from '@mui/material/IconButton';
    import Typography from '@mui/material/Typography';
    import CloseIcon from '@mui/icons-material/Close';
    import Slide from '@mui/material/Slide';

    const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
    });

    export default function CustomDialog({openDialog=false}) {
    const [open, setOpen] = React.useState(openDialog);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
            Open full-screen dialog
        </Button>
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{
            transition: Transition,
            }}
            PaperProps={{
        sx: {
        background: "rgba(137, 209, 184, 0.6)", // darker background
        backdropFilter: "blur(100px)",  // blur effect
        }
    }}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: "#27586f",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Sound
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                save
                </Button>
            </Toolbar>
            </AppBar>
            <List>
            <ListItemButton>
                <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemText
                primary="Default notification ringtone"
                secondary="Tethys"
                />
            </ListItemButton>
            </List>
        </Dialog>
        </React.Fragment>
    );
    }
