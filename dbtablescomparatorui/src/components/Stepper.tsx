import {
  Box,
  Button,
  Step,
  StepIconProps,
  StepLabel,
  Typography,
  styled,
} from "@mui/material";
import * as React from "react";
import { Stepper as Steppermu } from "@mui/material";
import SelectTables from "./SelectTables";
import SelectColumns from "./SelectColumns";
import ExecuteScript from "./ExecuteScript";
import Check from "@mui/icons-material/Check";

import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Result from "./Result";
const steps = [
  "Execute Script A",
  "Select Tables To Compare",
  "Select Columns To Compare By",
  "Execute Script B",
  "Get Results",
];

interface Stepper {
  activeStep: number;
}
export interface table {
  name: string;
  selectedColumns: string[];
}
export default function Stepper() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const tablesNames = React.useRef(new Set<string>());

  const [tables, setTables] = React.useState<table[]>([
    {
      name: "",
      selectedColumns: [],
    },
  ]);

  const addSelectedTable = (tableName: string) => {
    tablesNames.current.add(tableName);
  };

  const handleStep1Next = () => {
    setActiveStep(1);
  };
  const handleStep2Next = () => {
    localStorage.removeItem("selectedColumns");
    localStorage.removeItem("allColumns");

    setActiveStep(2);
  };
  const handleStep3Next = () => {
    setActiveStep(3);
  };
  const handleStep4Next = () => {
    setActiveStep(4);
  };
  const handleStep5Next = () => {
    setActiveStep(5);
  };

  const handleBack = () => {
    setTables([
      {
        name: "",
        selectedColumns: [],
      },
    ]);
    tablesNames.current.clear();
    setActiveStep(0);
  };

  const handleBack1 = () => {
    setTables([
      {
        name: "",
        selectedColumns: [],
      },
    ]);
    tablesNames.current.clear();
    setActiveStep(0);
  };

  const handleBack2 = () => {
    setActiveStep(1);
  };

  const handleBack3 = () => {
    setActiveStep(2);
  };

  const handleBack4 = () => {
    setActiveStep(3);
  };

  const handleBack5 = () => {
    setActiveStep(4);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <LooksOneIcon />,
      2: <LooksTwoIcon />,
      3: <Looks3Icon />,
      4: <Looks4Icon />,
      5: <Looks5Icon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
  }));

  return (
    <Box
      sx={{
        width: "100%",
        height: window.screen.height * 2,
        alignItems: "center",
      }}
    >
      <Steppermu activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Steppermu>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep == 0 ? (
            <ExecuteScript
              scriptName="A"
              handleNext={handleStep1Next}
              handleBack={handleBack}
              isFirst={true}
            />
          ) : (
            <></>
          )}

          {activeStep == 1 ? (
            <SelectTables
              addSelectedTable={addSelectedTable}
              handleBack={handleBack}
              handleNext={handleStep2Next}
            />
          ) : (
            <></>
          )}

          {activeStep == 2 ? (
            <SelectColumns
              handleBack={handleBack2}
              handleNext={handleStep3Next}
              selectedTables={tablesNames.current}
            />
          ) : (
            <></>
          )}

          {activeStep == 3 ? (
            <ExecuteScript
              scriptName="B"
              handleNext={handleStep4Next}
              handleBack={handleBack3}
              isFirst={false}
            />
          ) : (
            <></>
          )}

          {activeStep == 4 ? (
            <Result handleNext={handleStep4Next} handleBack={handleBack} />
          ) : (
            <></>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}
