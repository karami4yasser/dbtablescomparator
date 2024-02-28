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
  TablePagination,
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
  const [tableData, setTableData] = React.useState<any>(null); // Initialize empty table data
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null); // Track selected table
  const [dataFilter, setDataFilter] = React.useState<string>("ALL");
  const [fileType, setFileType] = React.useState<string>("PDF");

  const fetchData = async (tableName: string, selectedColumns: string[]) => {
    // Make your API call here, passing tableName and selectedColumns
    // Example using async/await:
    try {
      setLoading(true);
      const response = await compareTablesData(
        tableName,
        dataFilter,
        selectedColumns
      );
      const data = await response.data;

      console.log("response" + response.data);
      setTableData(response.data);
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

  const handleFetch = () => {
    if (!selectedTable) {
      toast.error("No Table Is Selected");
    } else {
      fetchData(selectedTable, selectedColumns[selectedTable]);
    }
  };
  const [pg, setpg] = React.useState(0);
  const [rpg, setrpg] = React.useState(5);

  function handleChangePage(event: any, newpage: any) {
    setpg(newpage);
  }

  function handleChangeRowsPerPage(event: any) {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  }

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
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          pt: 2,
        }}
      >
        <Button
          color="inherit"
          disabled={false}
          onClick={handleBack}
          sx={{
            width: 150,
            height: 50,
            backgroundColor: "white",
            marginRight: 10,
          }}
        >
          Reset
        </Button>
        <Button
          onClick={handleDownload}
          color="inherit"
          disabled={selectedTable ? false : true}
          sx={{
            width: 150,
            height: 50,
            backgroundColor: "white",

            marginRight: 10,
          }}
        >
          {"Download fILE"}
        </Button>

        <Button
          onClick={handleFetch}
          color="inherit"
          disabled={selectedTable ? false : true}
          sx={{
            width: 150,
            height: 50,
            backgroundColor: "white",
          }}
        >
          {"Get Results"}
        </Button>
        <Box sx={{ flex: "1 1 auto", marginBottom: 12 }} />
      </Box>

      {tableData && tableData.length > 0 && (
        <Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: "wheat" }}>
                    Current Table {" > "}
                  </TableCell>
                  {Object.keys(tableData[0]?.table?.rowColumnsMap).map(
                    (col) => (
                      <TableCell>{col}</TableCell>
                    )
                  )}
                  <TableCell style={{ backgroundColor: "wheat" }}>
                    Temp Old Table {" > "}
                  </TableCell>
                  {Object.keys(tableData[0]?.table?.rowColumnsMap).map(
                    (col) => (
                      <TableCell>{col}</TableCell>
                    )
                  )}
                  <TableCell>Are Equals</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(pg * rpg, pg * rpg + rpg)
                  .map((item: any, index: any) => (
                    <React.Fragment key={index}>
                      {/* Row for Table */}
                      <TableRow
                        style={{
                          backgroundColor: "white",
                        }}
                      >
                        <TableCell style={{ backgroundColor: "wheat" }}>
                          Current Table {" > "}
                        </TableCell>
                        {Object.keys(item?.table?.rowColumnsMap).map((col) => (
                          <TableCell
                            style={{
                              color: item.diffColumns.includes(col)
                                ? "red"
                                : "black",
                            }}
                          >
                            {item?.table?.rowColumnsMap[col]}
                          </TableCell>
                        ))}

                        <TableCell style={{ backgroundColor: "wheat" }}>
                          Temp Old Table {" > "}
                        </TableCell>
                        {/* Empty cells for Temp Table */}
                        {Object.keys(item?.temp_table?.rowColumnsMap).map(
                          (col) => (
                            <TableCell
                              style={{
                                color: item.diffColumns.includes(col)
                                  ? "red"
                                  : "black",
                              }}
                            >
                              {item?.temp_table?.rowColumnsMap[col]}
                            </TableCell>
                          )
                        )}
                        <TableCell>{item.areEquals.toString()}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rpg}
            page={pg}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      {tableData && tableData.length == 0 && (
        <Typography
          style={{
            fontSize: 50,
            textAlign: "center",
          }}
        >
          No Different Data
        </Typography>
      )}
    </Box>
  );
}
