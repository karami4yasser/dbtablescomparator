import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Step,
  StepLabel,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { getTablesColumns } from "../services/DbTablesComparatorService";
import { table } from "./Stepper";
import { Map } from "typescript";

export interface SelectColumnsProps {
  selectedTables: Set<string>;
  handleNext: () => void;
  handleBack: () => void;
}

export default function SelectColumns(props: SelectColumnsProps) {
  const [loading, setLoading] = React.useState<boolean>(true);

  const tablesDetails = React.useRef<Record<string, string[]>>({});
  const tablesNames = React.useRef(new Set<string>());

  const [error, setError] = React.useState<boolean>(false);

  const [selectedColumns, setSelectedColumns] = React.useState<
    Record<string, string[]>
  >({});

  React.useEffect(() => {
    (async () => {
      const results = await getTablesColumns(Array.from(props.selectedTables));
      if (results.status == 200) {
        tablesDetails.current = results.data;
        setSelectedColumns(initializeSelectedColumns(tablesDetails.current));
        setError(false);
        setLoading(false);
        for (let key in tablesDetails.current) {
          tablesNames.current.add(key);
        }
        console.log(tablesDetails.current);
        console.log(tablesNames.current);
      } else {
        setLoading(false);
        setError(true);
      }
    })();
  }, []);

  const handleNext = () => {
    console.log(selectedColumns);
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    props.handleNext();
  };

  const handleBack = () => {
    props.handleBack();
  };

  const initializeSelectedColumns = (
    tablesDetails: Record<string, string[]>
  ) => {
    const selectedColumns: Record<string, string[]> = {};
    for (const tableName in tablesDetails) {
      selectedColumns[tableName] = [...tablesDetails[tableName]]; // Deep copy
    }
    // Add empty arrays for missing tables:
    for (const tableName of Array.from(tablesNames.current)) {
      if (!selectedColumns.hasOwnProperty(tableName)) {
        selectedColumns[tableName] = []; // Initialize with an empty array
      }
    }
    return selectedColumns;
  };

  const handleColumnChange = (tableName: string, column: string) => {
    setSelectedColumns((prevSelectedColumns) => ({
      ...prevSelectedColumns,
      [tableName]: (prevSelectedColumns[tableName] || []).includes(column)
        ? (prevSelectedColumns[tableName] || []).filter((col) => col !== column) // Remove if checked
        : [...(prevSelectedColumns[tableName] || []), column], // Add if unchecked
    }));
  };

  if (loading) {
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
          Loading Available Tables from DB ....
        </Typography>
      </Box>
    );
  }

  if (error) {
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
          Something went wrong , Please try again later ....
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        flex: 1,
        flexGrow: 1,
        margin: 10,
        height: "100%",
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
        {"Select Columns To compare By "}
      </Typography>

      {tablesNames.current.size > 0 &&
        Array.from(tablesNames.current).map((tableName: string) => (
          <Box key={tableName} sx={{ my: 2 }}>
            <Typography variant="h5">Table : {tableName}</Typography>
            {tablesDetails.current[tableName].map((column) => (
              <FormControlLabel
                key={column}
                control={
                  <Checkbox
                    checked={selectedColumns[tableName]?.includes(column)}
                    onChange={() => handleColumnChange(tableName, column)}
                  />
                }
                label={column}
              />
            ))}
          </Box>
        ))}

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={false}
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
