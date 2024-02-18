import { Box, Button, Step, StepLabel, Typography } from "@mui/material";
import * as React from "react";

interface ExecuteScriptProps {
  scriptName: string;
  handleNext: () => void;
  handleBack: () => void;
  isFirst: boolean;
}
export default function ExecuteScript(props: ExecuteScriptProps) {
  const handleNext = () => {
    props.handleNext();
  };

  const handleBack = () => {
    props.handleBack();
  };
  return (
    <Box
      sx={{
        flex: 1,
        flexGrow: 1,
        margin: 10,

        height: "10%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          flex: 1,

          fontSize: 25,
          fontWeight: "600",
        }}
      >
        Please Execute Script {props.scriptName} in the Database
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={true}
          onClick={handleBack}
          sx={{ width: 50, height: 50, backgroundColor: "white" }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleNext}
          color="inherit"
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "white",
          }}
        >
          {"Next"}
        </Button>
      </Box>
    </Box>
  );
}
