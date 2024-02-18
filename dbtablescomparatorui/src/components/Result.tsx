import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
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
  getTablesColumns,
} from "../services/DbTablesComparatorService";
import { table } from "./Stepper";
import { Map } from "typescript";
import { Console } from "console";

export interface ResultColumnsProps {
  handleNext: () => void;
  handleBack: () => void;
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

  const handleViewSwitch = (tableName: string) => {
    setSelectedTable(tableName);
    setLoading(true);
    // Fetch data from backend based on selected table and selected columns
    fetchData(tableName, selectedColumns[tableName]);
  };

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
      <Typography sx={{ margin: 5 }}>
        Choose a Table To get The Result
      </Typography>
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
          {Object.keys(selectedColumns).map((tableName) => (
            <button
              style={{
                flex: 1,
                paddingLeft: 10,
                marginBottom: 10,
              }}
              key={tableName}
              onClick={() => handleViewSwitch(tableName)}
            >
              {tableName}
            </button>
          ))}
        </div>

        {selectedTable && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: "wheat" }}>
                    Current Table {" > "}
                  </TableCell>
                  {Object.keys(tableData[0].table.rowColumnsMap).map((col) => (
                    <TableCell>{col}</TableCell>
                  ))}
                  <TableCell style={{ backgroundColor: "wheat" }}>
                    Temp Old Table {" > "}
                  </TableCell>
                  {Object.keys(tableData[0].table.rowColumnsMap).map((col) => (
                    <TableCell>{col}</TableCell>
                  ))}
                  <TableCell>Are Equals</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item: any, index: any) => (
                  <React.Fragment key={index}>
                    {/* Row for Table */}
                    <TableRow
                      style={{
                        backgroundColor: item.areEquals ? "white" : "red",
                      }}
                    >
                      <TableCell style={{ backgroundColor: "wheat" }}>
                        Current Table {" > "}
                      </TableCell>
                      {Object.keys(item.table.rowColumnsMap).map((col) => (
                        <TableCell>{item.table.rowColumnsMap[col]}</TableCell>
                      ))}

                      <TableCell style={{ backgroundColor: "wheat" }}>
                        Temp Old Table {" > "}
                      </TableCell>
                      {/* Empty cells for Temp Table */}
                      {Object.keys(item.temp_table.rowColumnsMap).map((col) => (
                        <TableCell>
                          {item.temp_table.rowColumnsMap[col]}
                        </TableCell>
                      ))}
                      <TableCell>{item.areEquals.toString()}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
