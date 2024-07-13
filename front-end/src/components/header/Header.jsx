import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

// Define styles using makeStyles
const useStyles = makeStyles(() => ({
  logo: {
    height: '100%',
    width: '200px',
  },
}));

// Create a theme with Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#252525',
    },
  },
});

function Header() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: '10px' }}>
              <img src={Logo} alt="ViStream" className={classes.logo} />
            </Typography>
            <Link to="/sign-in" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ color: '#fff' }}>Login</Button>
            </Link>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, color: '#ff000f' }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default Header;
