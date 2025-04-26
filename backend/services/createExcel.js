import xlsx from 'xlsx';
import { today } from './date.js';

export function createExcel(schoolDistricts,centralDistricts,specialDistricts, masterFile) {
    // Create a new workbook object
    const workbook = xlsx.utils.book_new();
    // Define headers for each worksheet
    const headers = [["Allocation Category","Location","Location Amount","Tlump comments","Comments","SAM/CAM","District","Fund Source Code","Grant#","Type","Title", "Tracking#"]];
    const Daily_File_Formatted_headers=[["Location", "Location Amount", "Grant#", "Fund Source Code", "Funding Source", "Type", "Title" ,"Comments", "District", "Amount", "From","To","Tracking#", "Contact", "Phone","LogDate","FS10_Project_Number","Donor"]]

    // Create sheets with headers and data
    const sheetA = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(schoolDistricts).map(key => 
                headers[0].map(header => schoolDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetB = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(centralDistricts).map(key => 
                headers[0].map(header => centralDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetC = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(specialDistricts).map(key => 
                headers[0].map(header => specialDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    
    // const sheetB = xlsx.utils.aoa_to_sheet(
    //     [headers[0]].concat(Object.keys(centralDistrictData).map(key => Object.values(centralDistrictData[key])))
    // );
    const sheetD = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(masterFile).map(key => 
                headers[0].map(header => masterFile[key][header] || "") // Fill missing fields with blank
            )
        )
    );

    const sheetE = xlsx.utils.aoa_to_sheet(
        [Daily_File_Formatted_headers[0]].concat(Object.keys(masterFile).map(key => Object.values(masterFile[key])))
    );

    // Append sheets to the workbook
    xlsx.utils.book_append_sheet(workbook, sheetA, 'Schools CSDs 1-32');
    xlsx.utils.book_append_sheet(workbook, sheetB, 'Central All Others');
    xlsx.utils.book_append_sheet(workbook, sheetC, 'Special CSDs 79 85 97');
    xlsx.utils.book_append_sheet(workbook, sheetD, 'Daily File_1');
    xlsx.utils.book_append_sheet(workbook, sheetE, 'Daily File Formatted');

    // Write the workbook to a file
    // const date = today();
    // const filePath = `Daily File Report ${date}.xlsx`;
     return workbook
//  console.log(schoolsOfDistrictData)
    console.log(`Workbook with sheets created and saved as ${filePath}`);
}
