import express from 'express';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cors from 'cors';

import { readExcelFile, findHeaderCells, processData } from './services/excelProcess.js';
import { sortDistricts } from './services/sortDistricts.js';
import { createExcel } from './services/createExcel.js';

// emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors())
// Multer setup
const upload = multer({ dest: 'Data/' }); // saved temporarily in /Data/

app.post('/process-excel', upload.single('excelFile'), (req, res) => {
  try {
    const uploadedFilePath = req.file.path; // multer gives you the uploaded file path

    const { worksheet } = readExcelFile(uploadedFilePath);

    const headerGroup = [
      "Location", "Location Amount", "Grant#", "Fund Source Code", "Funding Source",
      "Type", "Title", "Comments", "District", "Amount", "From", "To", "Tracking#",
      "Contact", "Phone", "LogDate", "FS10_Project_Number", "Donor"
    ];
    const headerCells = findHeaderCells(worksheet);
    const baseData = processData(worksheet, headerGroup, headerCells);
    const sortData = sortDistricts(baseData);

    const workbook = createExcel(
      sortData.schoolDistricts,
      sortData.centralDistricts,
      sortData.specialDistricts,
      sortData.masterFile
    );

    // Send workbook as response
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Daily_File_Report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

    // Clean up uploaded file
    fs.unlinkSync(uploadedFilePath);

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).send('An error occurred while processing the file.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
