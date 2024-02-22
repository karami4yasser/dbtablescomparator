import ApiService from "../utils/api";

export async function getTables() {
  let result = await ApiService.get("/api/dbtablescomparator/tables");
  return result;
}

export async function getTablesColumns(tableName: string[]) {
  let requestParam = tableName.reduce(joinStrings);
  let result = await ApiService.get(
    `/api/dbtablescomparator/tables/details?tableNames=${requestParam}`
  );
  return result;
}

export async function createTempTable(tables: string[]) {
  let requestParam = tables.reduce(joinStrings);
  let result = await ApiService.get(
    `/api/dbtablescomparator/savetemp?tables=${requestParam}`
  );
  return result;
}

export async function compareTablesData(tableName: string, columns: string[]) {
  let requestParam = columns.reduce(joinStrings);
  let result = await ApiService.get(
    `/api/dbtablescomparator/${tableName}?columns=${requestParam}`
  );
  return result;
}

export async function generatePdf(tableName: string, columns: string[]) {
  let requestParam = columns.reduce(joinStrings);
  let result = await ApiService.get(
    `/api/dbtablescomparator/pdf/${tableName}?columns=${requestParam}`
  );
  console.log(result.data);
  return result;
}

// function to join each string elements
export function joinStrings(accumulator: string, currentValue: string) {
  return accumulator + "," + currentValue;
}
