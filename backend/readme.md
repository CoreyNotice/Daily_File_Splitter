import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { sortDistricts } from './services/sortDistricts.js';
import { createExcel } from './services/createExcel.js';

// File path and workbook setup
const filePath = 'C:\\Users\\NYCDOE\\Desktop\\DailyData_split\\backend\\Data\\DailyData-4-17-2025.xlsx';
const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];


// Headers group
const headerGroup = [
    "Location", "Location Amount", "Grant#", "Fund Source Code", "Funding Source",
    "Type", "Title", "Comments", "District", "Amount", "From", "To", "Tracking#",
    "Contact", "Phone", "LogDate", "FS10_Project_Number", "Donor"
];

/// ✅ Function to find header positions dynamically
function findHeaderCells() {
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    let headerPositions = {};

    // 🔍 Loop through each cell to detect headers
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

// ✅ Find all headers in the sheet
const headerCells = findHeaderCells();

let baseData = [];

// Iterate through each row of the worksheet starting below the headers
const range = xlsx.utils.decode_range(worksheet['!ref']);
const maxRow = range.e.r; // Last row index
const minRow = range.s.r + 1; // Start from the row after the header

for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
    const rowData = {}; // Create a new object for each row

    headerGroup.forEach(header => {
        if (headerCells[header]) {
            const headerCellDecoded = xlsx.utils.decode_cell(headerCells[header].ref);
            const dataColumnIndex = headerCellDecoded.c;
            
            const cellRef = xlsx.utils.encode_cell({ c: dataColumnIndex, r: rowIndex });
            const cell = worksheet[cellRef];
            
            
             // Assign header value or null if the cell is missing
             rowData[header] = cell ? (cell.w || cell.v) : null;
            } else {
                rowData[header] = null; // Handle unmapped headers gracefully
            }
        });

    if (Object.values(rowData).some(value => value !== null)) {
        baseData.push(rowData); // Add to baseData
    }
}



const sortData = sortDistricts(baseData);

createExcel(
    sortData.schoolDistricts,
    sortData.centralDistricts,
    sortData.specialDistricts,
    sortData.masterFile
);
