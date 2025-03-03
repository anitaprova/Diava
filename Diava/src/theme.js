import { createTheme } from "@mui/material/styles";

const colors = {
  sand: "#CEC1A8",
  brown: "#B59E7E",
  darkbrown: "#5D4B3D",
  grey: "#AAA396",
  vanilla: "#F1EADA",
  cream: "#EEE7D7",
  black: "#00000",
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.brown,
    },
    secondary: {
      main: colors.darkbrown,
    },
    background: {
      default: colors.vanilla,
      paper: colors.vanilla,
    },
    text: {
      primary: colors.darkbrown,
      secondary: colors.grey,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.brown,
          "&:hover": {
            backgroundColor: colors.darkbrown,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.cream,
          color: colors.darkbrown,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Cinzel', serif",
        },
      },
    },
  },
});

export default theme;
