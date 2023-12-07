const XLSX = require('xlsx')
exports.insertNewSheet = (wb, sheetName, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
}

exports.createNewExcel = async (sheets) => {
    const wb = XLSX.utils.book_new();
    sheets.map((sheet) => {
        XLSX.utils.book_append_sheet(wb, sheet.ws, sheet.sheetName?.toString())
    })
    return wb
}

