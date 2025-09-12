import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoute from "./route/route";
import apolloClient from "./apolloClient";
import { ApolloProvider } from "@apollo/client/react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fbbc04",
    },
    secondary: {
      main: "#5f6368",
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoute />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
