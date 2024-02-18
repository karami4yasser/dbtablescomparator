import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Step,
  StepLabel,
  Switch,
  Typography,
} from "@mui/material";
import * as React from "react";
import {
  createTempTable,
  getTables,
} from "../services/DbTablesComparatorService";

export interface SelectTablesProps {
  addSelectedTable: (tableName: string) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export default function SelectTables(props: SelectTablesProps) {
  const [loading, setLoading] = React.useState<boolean>(true);

  const [tables, setTables] = React.useState<string[]>([]);

  const [selectedTables, setSelectedTables] = React.useState<string[]>([]);

  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const results = await getTables();
      if (results.status == 200) {
        setTables(results.data);
        setLoading(false);
        setError(false);
        localStorage.setItem(
          "allColumns",
          JSON.stringify(initializeSelectedColumns(results.data))
        );
      } else {
        setLoading(false);
        setError(true);
      }
    })();
  }, []);
  const initializeSelectedColumns = (
    tablesDetails: Record<string, string[]>
  ) => {
    const selectedColumns: Record<string, string[]> = {};
    for (const tableName in tablesDetails) {
      selectedColumns[tableName] = [...tablesDetails[tableName]]; // Deep copy
    }
    return selectedColumns;
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = selectedTables.indexOf(value);
    const newChecked = [...selectedTables];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedTables(newChecked);
  };

  const handleNext = async () => {
    selectedTables.map((value: string) => props.addSelectedTable(value));

    const result = await createTempTable(selectedTables);
    props.handleNext();
  };

  const handleBack = () => {
    props.handleBack();
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

        height: "50%",
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
        Select Tables To compare
      </Typography>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        {tables.map((value) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem
              key={tables.indexOf(value)}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(value)}
                  checked={selectedTables.indexOf(value) !== -1}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemText id={labelId} primary={`${value}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

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
