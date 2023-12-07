const { Get, SearchThongDiepByDate, getThongDiepById, SearchDetailSent, SearchDetailReceived } = require('../service/mvan/thongdiep');
const { ErrorHandler, ResponseApi } = require('../../middleware/error-handled');
const { STATUS } = require('../../extensions/constants-manager');
const { CreateCache, GetCache } = require('../../extensions/redis-cache');
const ThongDiep = require('../models/mvan/thongdiep');
const { log, error } = require('winston');
const XLSX = require('xlsx');
const {createNewExcel} = require('../../extensions/xlxs');
const { date } = require('joi');
const stream = require('stream')
/**
 * Get thongdiep
 * @public
 */
exports.getThongDiepById = async (req, res, next) => {
  try {
    const data = await GetCache(req.path, req.params);
    let response = new ThongDiep();
    if (data) response = new ThongDiep(data);
    else {
      response = await Get(req.params.thongdiepId);
      await CreateCache(response, req.path, req.params);
    }
    return res.json(ResponseApi(0, null, response));
  }
  catch (error) {
    return next(error);
  }
};

exports.searchThongDiepByDate = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    const data = await SearchThongDiepByDate(fromDate, toDate);
    return res.json(ResponseApi(0, null, data));
  }
  catch (error) {
    return next(error);
  }
};

exports.searchDetailSent = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    const data = await SearchDetailSent(fromDate, toDate);
    return res.json(ResponseApi(0, null, data));
  }
  catch (error) {
    return next(error);
  }
}

exports.searchDetailReceived = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    const data = await SearchDetailReceived(fromDate, toDate);
    return res.json(ResponseApi(0, null, data));
  }
  catch (error) {
    return next(error)
  }
}

// exports.exportExcelThongDiepByDate = async (req, res, next) => {
//   try {
//     const { fromDate, toDate } = req.body;
//     const data = await SearchThongDiepByDate(fromDate, toDate);
//     return res.json(data);
//   }
//   catch (error) {
//     return next(error);
//   }
// };

// exports.exportExcelDetailSent = async (req, res, next) => {
//   try {
//     const { fromDate, toDate } = req.body;
//     const data = await SearchDetailSent(fromDate, toDate);
//     return res.json(data);
//   }
//   catch (error) {
//     return next(error);
//   }
// };

// exports.exportExcelDetailReceived = async (req, res, next) => {
//   try {
//     const { fromDate, toDate } = req.body;
//     const data = await SearchDetailReceived(fromDate, toDate);
//     return res.json(data);
//   }
//   catch (error) {
//     return next(error);
//   }
// };

exports.exportExcelDetailSent = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    return res.json(await SearchDetailSent(fromDate, toDate));
  }
  catch (error) {
    return next(error);
  }
};

exports.exportExcelDetailReceived = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    return res.json(await SearchDetailReceived(fromDate, toDate));
  }
  catch (error) {
    return next(error);
  }
};

exports.exportExcelThongDiepByDate = async (req, res, next) => {
  try {
    const filename = "bao_cao_tong_hop_thong_diep.xlsx"
    res.set('Content-Disposition', 'attachment; filename=' + filename);
    res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    const { fromDate, toDate } = req.body;
    const data = await SearchThongDiepByDate(fromDate, toDate);
    const sheets = data.map((item) => {
      return {
        sheetName: item.totalSentUp
        // ws: XLSX.utils.json_to_sheet(item.children)
      }
    })
    const wb = await createNewExcel(sheets);
    const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'base64', cellStyles: true });
    res.end(excelBuffer)
  } catch (error) {
    return next(error)
  }
}
exports.downloadErrorMessages = async (req, res, next) => {
  try {
    const filename = "bao_cao_thong_diep_loi.xlsx";
    res.set('Content-Disposition', 'attachment; filename=' + filename);
    res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    const data = await GetErrorMessages({ from: req.query.from, to: req.query.to });
    const sheets = data.map((item) => {
      return {
        sheetName: item.lTBaoMsg,
        ws: XLSX.utils.json_to_sheet(item.children)
      }
    })
    const wb = await createNewExcel(sheets);
    const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'base64', cellStyles: true });
    res.end(excelBuffer)


  }
  catch (error) {
    return next(error);
  }
};



exports.exportExcelDetailSent = async (req, res, next) => {
  try {
    const filename = "bao_cao_chi_tiet_thong_diep_gui_len.xlsx"
    res.set('Content-Disposition', 'attachment; filename=' + filename);
    res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    const { fromDate, toDate } = req.body;
    const data = await SearchDetailSent(fromDate, toDate);
    const sheets = data.map((item) => {
      return {
        sheetName: item.total
        // ws: XLSX.utils.json_to_sheet(item.children)
      }
    })
    const wb = await createNewExcel(sheets);
    const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const readStream = new stream.PassThrough();
    readStream.end(new Uint8Array(excelBuffer));
    readStream.pipe(res);
  }
  catch (error) {
    return next(error);
  }
};

exports.exportExcelDetailReceived = async (req, res, next) => {
  try {
    const filename = "bao_cao_chi_tiet_thong_diep_gui_len.xlsx"
    res.set('Content-Disposition', 'attachment; filename=' + filename);
    res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    const { fromDate, toDate } = req.body;
    const data = await SearchDetailReceived(fromDate, toDate);
    const sheets = data.map((item) => {
      return {
        sheetName: item.total
        // ws: XLSX.utils.json_to_sheet(item.children)
      }
    })
    const wb = await createNewExcel(sheets);
    const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const readStream = new stream.PassThrough();
    readStream.end(new Uint8Array(excelBuffer));
    readStream.pipe(res);
  }
  catch (error) {
    return next(error);
  }
};




// exports.downloadMessageOverall = async (req, res, next) => {
//   try {
//     const filename = "bao_cao_tong_hop_thong_diep.xlsx"
//     res.set('Content-Disposition', 'attachment; filename=' + filename);
//     res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

//     const data = await GetMessageOverall({ from: req.query.from, to: req.query.to })
//     const sheets = data.map((item) => {
//       return {
//         sheetName: item.mLTDiep,
//         ws: XLSX.utils.json_to_sheet(item.children)
//       }
//     })
//     const wb = await createNewExcel(sheets);
//     const excelBuffer = await XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
//     const readStream = new stream.PassThrough();
//     readStream.end(new Uint8Array(excelBuffer));
//     readStream.pipe(res);
//   } catch (error) {
//     return next(error)
//   }
// }