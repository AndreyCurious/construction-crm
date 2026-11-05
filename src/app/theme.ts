import { ruRU } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme(
  {
    palette: {
      primary: { main: "#275c4c", dark: "#183c32" },
      background: { default: "#f6f7f9", paper: "#ffffff" },
      text: { primary: "#222d39", secondary: "#72808d" },
      divider: "#e9ecf0"
    },
    typography: {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      h4: { fontSize: "1.8rem", fontWeight: 650, letterSpacing: "-0.6px" },
      h5: { fontWeight: 650, fontSize: "1.35rem" },
      h6: { fontWeight: 600, fontSize: "1.05rem" },
      button: { textTransform: "none", fontWeight: 600 },
      body2: { fontSize: "0.84rem" }
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 7, minHeight: 38, paddingInline: 16, whiteSpace: "nowrap" } }
      },
      MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { outlined: { borderColor: "#e5e9ed" } } },
      MuiDialogTitle: { styleOverrides: { root: { padding: "24px 24px 16px" } } },
      MuiDialogActions: { styleOverrides: { root: { padding: "16px 24px 24px" } } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: "#eef0f3", padding: "18px 20px" },
          head: { color: "#72808d", fontSize: 12, fontWeight: 600, background: "#fcfcfd" }
        }
      }
    }
  },
  ruRU
);
