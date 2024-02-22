import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import {
  compareTablesData,
  generatePdf,
  getTablesColumns,
  joinStrings,
} from "../services/DbTablesComparatorService";
import { table } from "./Stepper";
import { Map } from "typescript";
import { Console } from "console";
import toast from "react-hot-toast";
import { BASE_API } from "../utils/Constant";

export interface ResultColumnsProps {
  handleNext: () => void;
  handleBack: () => void;
}

export enum DataFilter {
  ALL,
  DIFF,
}

export enum FileType {
  PDF,
  CSV,
}

export default function Result(props: ResultColumnsProps) {
  const STORAGE_KEY = "selectedColumns";
  const STORAGE_KEY_ALL = "allColumns";

  const [loading, setLoading] = React.useState<boolean>(false);

  const [selectedColumns, setSelectedColumns] = React.useState<
    Record<string, string[]>
  >({});

  const [allColumns, setAllColumns] = React.useState<Record<string, string[]>>(
    {}
  );

  React.useEffect(() => {
    const loadFromStorage = () => {
      const storedData = localStorage.getItem(STORAGE_KEY);

      const storedData2 = localStorage.getItem(STORAGE_KEY_ALL);

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log(parsedData);
          setSelectedColumns(parsedData);
        } catch (error) {
          // Handle parsing error gracefully, e.g., log the error or reset to defaults
          console.error("Error parsing stored data:", error);
        }
      }

      if (storedData2) {
        try {
          const parsedData2 = JSON.parse(storedData2);
          console.log(parsedData2);
          setAllColumns(parsedData2);
        } catch (error) {
          // Handle parsing error gracefully, e.g., log the error or reset to defaults
          console.error("Error parsing stored data:", error);
        }
      }
    };

    loadFromStorage();
  }, []);
  function handleBack(): void {
    props.handleBack();
  }

  function handleNext(): void {
    props.handleNext();
  }
  const [tableData, setTableData] = React.useState<any>({}); // Initialize empty table data
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null); // Track selected table
  const [dataFilter, setDataFilter] = React.useState<string>("ALL");
  const [fileType, setFileType] = React.useState<string>("PDF");

  const fetchData = async (tableName: string, selectedColumns: string[]) => {
    // Make your API call here, passing tableName and selectedColumns
    // Example using async/await:
    try {
      const response = await compareTablesData(tableName, selectedColumns);
      const data = await response.data;

      console.log("response" + response.data);
      setTableData(response.data);
      setLoading(false);
    } catch (error) {
      // Handle errors gracefully, e.g., display an error message
      console.error("Error fetching data:", error);
    }
  };

  const downloadData = async (tableName: string, selectedColumns: string[]) => {
    // Make your API call here, passing tableName and selectedColumns
    // Example using async/await:
    try {
      const response = await generatePdf(tableName, selectedColumns);
      console.log(response);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setLoading(false);
    } catch (error) {
      // Handle errors gracefully, e.g., display an error message
      console.error("Error fetching data:", error);
    }
  };
  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataFilter((event.target as HTMLInputElement).value);
  };
  const onTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTable((event.target as HTMLInputElement).value);
  };

  const onFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileType((event.target as HTMLInputElement).value);
  };

  const handleDownload = () => {
    if (!selectedTable) {
      toast.error("No Table Is Selected");
    } else {
      let requestParam = selectedColumns[selectedTable].reduce(joinStrings);
      window.open(
        `${BASE_API}/api/dbtablescomparator/doc/${selectedTable}?filter=${dataFilter}&filetype=${fileType}&columns=${requestParam}`,
        "_blank"
      );
    }
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
          Loading DATA from DB ....
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
        height: window.screen.height,
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      ></div>
      <div
        style={{
          flex: 1,
        }}
      >
        {/* View selection */}
        <div
          style={{
            flex: 1,

            alignContent: "space-around",
          }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Select A Table To get Results{" "}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={onTableChange}
              value={selectedTable}
            >
              {Object.keys(selectedColumns).map((tableName) => (
                <FormControlLabel
                  value={tableName}
                  control={<Radio />}
                  label={tableName}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        {/* View selection */}
        <div
          style={{
            flex: 1,

            alignContent: "space-around",
          }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Do you want to get all data or just differences{" "}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={dataFilter}
              onChange={onFilterChange}
            >
              <FormControlLabel
                value={"ALL"}
                control={<Radio />}
                label="Show ALL"
              />
              <FormControlLabel
                value={"DIFF"}
                control={<Radio />}
                label="Show Diff"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* View selection */}
        <div
          style={{
            flex: 1,

            alignContent: "space-around",
          }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              File export Format :
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={fileType}
              onChange={onFileTypeChange}
            >
              <FormControlLabel value={"PDF"} control={<Radio />} label="PDF" />
              <FormControlLabel value={"CSV"} control={<Radio />} label="CSV" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
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
          onClick={handleDownload}
          color="inherit"
          sx={{
            width: 150,
            height: 50,
            backgroundColor: "white",
          }}
        >
          {"Download fILE"}
        </Button>
      </Box>
    </Box>
  );
}
