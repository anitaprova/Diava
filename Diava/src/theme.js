import { createTheme } from "@mui/material/styles";

const colors = {
  sand: "#CEC1A8",
  brown: "#B59E7E",
  coffee: "#CBBFA7",
  darkbrown: "#5D4B3D",
  grey: "#AAA396",
  vanilla: "#F1EADA",
  cream: "#EEE7D7",
  black: "#000000",
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
          fontFamily: "merriweather",
          backgroundColor: colors.brown,
          "&:hover": {
            backgroundColor: colors.darkbrown,
          },
        },
      },
      variants: [
        {
          props: { variant: "coffee" },
          style: {
            backgroundColor: colors.coffee,
            color: colors.darkbrown,
            "&:hover": {
              backgroundColor: colors.brown,
            },
          },
        },

        {
          props: { variant: "dark" },
          style: {
            backgroundColor: colors.darkbrown,
            color: colors.cream,
            "&:hover": {
              backgroundColor: colors.coffee,
            },
          },
        },
      ],
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
          fontFamily: "Merriweather",
        },
      },
      variants: [
        {
          props: { variant: "title" },
          style: {
            fontSize: "35px",
            fontWeight: 700,
            color: colors.darkbrown,
          },
        },
        {
          props: { variant: "subtitle" },
          style: {
            fontSize: "20px",
            fontWeight: 500,
            color: colors.grey,
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.cream,
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            border: `2px solid ${colors.darkbrown}`,
            backgroundColor: colors.white,
          },
        },
      ],
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {},
        },
      ],
    },
    MuiRating: {
      variants: [
        {
          props: { variant: "heart" },
          style: {
            color: "#ff6d75",
          },
        },
      ],
    },
  },
});

export default theme;
