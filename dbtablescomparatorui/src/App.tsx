import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import Stepper from "./components/Stepper";
import { Box } from "@mui/material";
function App() {
  return (
    <Box
      sx={{
        flex: 1,
        flexGrow: 1,
        padding: 10,
        backgroundColor: "#c4bfbe",
      }}
    >
      <Stepper />
    </Box>
  );
}

export default App;
