import xlsx from 'xlsx'

export function readExcelFile(filePath) {
  const workbook=xlsx.readFile(filePath)
  const worksheet= workbook.Sheets[workbook.SheetNames[0]]
  
    return {worksheet,workbook};
  
}

export function findHeaderCells(worksheet) {
  const range = xlsx.utils.decode_range(worksheet['!ref']);
  let headerPositions = {};

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = xlsx.utils.encode_cell(cell_address);

      if (worksheet[cell_ref] && worksheet[cell_ref].v) {
        let cellValue = worksheet[cell_ref].v.toString().trim();
        headerPositions[cellValue] = { ref: cell_ref, row: R, col: C };
      }
    }
  }

  return headerPositions;
}


export function processData(worksheet, headerGroup, headerCells) {
  const range = xlsx.utils.decode_range(worksheet['!ref']);
  const maxRow = range.e.r;
  const minRow = range.s.r + 1;

  let baseData = [];
  for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
    const rowData = {};

    headerGroup.forEach(header => {
      if (headerCells[header]) {
        const headerCellDecoded = xlsx.utils.decode_cell(headerCells[header].ref);
        const dataColumnIndex = headerCellDecoded.c;

        const cellRef = xlsx.utils.encode_cell({ c: dataColumnIndex, r: rowIndex });
        const cell = worksheet[cellRef];

        rowData[header] = cell ? (cell.w || cell.v) : null;
      } else {
        rowData[header] = null;
      }
    });

    if (Object.values(rowData).some(value => value !== null)) {
      baseData.push(rowData);
    }
  }

  return baseData;
}


