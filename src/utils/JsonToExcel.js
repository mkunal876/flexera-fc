const XLSX = require('xlsx')

const convertJsonToExcel = (jsonData, fileName)=> {


    const workSheet = XLSX.utils.json_to_sheet(jsonData)
    const workBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workBook, workSheet, "jsonData")

    //generate buffer

    XLSX.write(workBook, {bookType:'xlsx', type: 'buffer'})

    // binary string


 XLSX.write(workBook, {bookType:'xlsx', type: 'binary'});
 XLSX.writeFile(workBook, "riskAssetData.xlsx")

}

export default convertJsonToExcel;