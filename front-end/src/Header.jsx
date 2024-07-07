import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar'; import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    logo : {
        height : '80%',
        width: '200px'
    }
}));

const theme = createTheme({
    palette: {
      primary: {
        main: '#252525', // Red color
      },
    },
  });
function ButtonAppBar() {

    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1, bgcolor: 'primary.main'}} >
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: '10px' }}>
                        <img src="../images/logo.png" alt="ViStream" className={classes.logo} />
                    </Typography>
                    <Button color="inherit" sx={{ color:'#fff' }}>Login</Button>
                    <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2, color:'#ff000f'}}
                >
                    <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box >
        </ThemeProvider>
        
    );

}

export default ButtonAppBar