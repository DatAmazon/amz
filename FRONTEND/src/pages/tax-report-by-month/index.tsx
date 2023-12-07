import React, { useState, useEffect } from 'react';
import { Select, Button, Form, DatePicker, Table } from 'antd';
import axios from 'axios';
import 'dayjs/locale/vi';
import {base64ToArrayBuffer} from '@/utils/function-extensions';
interface DataType {
  indexs: number;
  mstTcgp: string;
  totalSentUp: number | null;
  totalReturn: number | null;
  total: number;
}

const ListTaxCodeOfSolutionOrganization: React.FC<DataType> = () => {
  axios.defaults.baseURL = "http://localhost:8000/api/thongdiep"
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDIxMjc2MjEsImlhdCI6MTcwMTkxMTYyMSwic3ViIjoiNjU1YzVmMDQwMDJlNGUwZTBjYWU2ZDUyIn0.7DgYcJc1uG_CD4deTG4CuSidan7nFrZ2rnTlQKBOPMY'
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const [dataList, setDataList] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [searchClicked, setSearchClicked] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async (values: any) => {
    const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
    const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
    try {
      const response = await axios.post("/message-by-date", {
        fromDate: fromDateValue,
        toDate: toDateValue
      });
      setDataList(response.data.data || []);
      return response
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportExcel = async (values: any) => {
    const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
    const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
    try {
      const response = await axios.post("/message-by-date/export-excel", {
        fromDate: fromDateValue,
        toDate: toDateValue
      });
      console.log('ttttttttttttttttttt', response);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchClicked && fromDate && toDate) {
      fetchData({ fromDate, toDate });
      setSearchClicked(false);
    }

  }, [searchClicked, fromDate, toDate]);

  const handleFromDateChange = (date: any) => { setFromDate(date); }
  const handleToDateChange = (date: any) => { setToDate(date); }
  const onFinish = (values: any) => { console.log('yyyyyyyyyyy', values); }
  const onFinishFailed = (errorInfo: any) => {
    console.log('fffffffffffffffff:', errorInfo);
  };
  const handleSearch = async () => {
    setSearchClicked(true);
  }
  const handleOnclickExport = async () => {
    await exportExcel({ fromDate, toDate });
  }

  const columns = [
    { title: 'STT', dataIndex: 'indexs', width: 150, },
    { title: 'MST TCGP', dataIndex: 'mstTcgp', width: 150, },
    { title: 'Tổng số gửi lên', dataIndex: 'totalSentUp', },
    { title: 'Tổng số trả về', dataIndex: 'totalReturn', },
    { title: 'Tổng cộng', dataIndex: 'total', }
  ];

  const data = (dataList as { MstTcgp: string, totalSentUp: number, totalReturn: number, total: number }[]).map((item, index) => ({
    indexs: index + 1,
    mstTcgp: item.MstTcgp,
    totalSentUp: item.totalSentUp || 0,
    totalReturn: item.totalReturn || 0,
    total: item.total,
  }));

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: '100%', backgroundColor: 'white', border: '1px solid #ccc', position: 'relative', borderRadius: '2px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 5px' }}>
          <div>
            <h3 style={{ margin: 0 }}>1. TỔNG HỢP THÔNG ĐIỆP</h3>
          </div>
          <div>
            <Button
              style={{
                backgroundColor: 'rgb(40, 167, 69)',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                color: 'white',
                marginRight: '8px',
              }}
              htmlType="submit"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              style={{
                backgroundColor: 'rgb(40, 167, 69)',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                color: 'white',
              }}
              htmlType='submit'
              onClick={handleOnclickExport}
            >
              Export excel
            </Button>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', width: '99%', borderRadius: '3px', margin: 'auto 6px' }}>
          <div style={{ width: '60%', display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
            <Form.Item label="Từ ngày" name="fromDate" initialValue={fromDate}>
              <DatePicker format={'YYYY/MM/DD'} onChange={handleFromDateChange} />
            </Form.Item>
            <Form.Item label="Đến ngày" name="toDate" initialValue={toDate}>
              <DatePicker format={'YYYY/MM/DD'} onChange={handleToDateChange} />
            </Form.Item>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 20,
            style: {
              position: 'absolute', top: '400px', right: '15px'
            },
          }}
          scroll={{ y: 360 }}
          style={{ border: '1px solid #ccc', width: '70%', minHeight: '450px', margin: '10px 6px', borderRadius: '3px' }}
        />
      </Form>
    </div>
  );
};
export default ListTaxCodeOfSolutionOrganization;







// import React, { useState, useEffect } from 'react';
// import { Select, Button, Form, DatePicker, Table } from 'antd';
// import axios from 'axios';
// import 'dayjs/locale/vi';

// interface DataType {
//   indexs: number;
//   mstTcgp: string;
//   totalSentUp: number | null;
//   totalReturn: number | null;
//   total: number;
// }

// const ListTaxCodeOfSolutionOrganization: React.FC<DataType> = () => {
//   axios.defaults.baseURL = "http://localhost:8000/api/thongdiep"
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDIxMjc2MjEsImlhdCI6MTcwMTkxMTYyMSwic3ViIjoiNjU1YzVmMDQwMDJlNGUwZTBjYWU2ZDUyIn0.7DgYcJc1uG_CD4deTG4CuSidan7nFrZ2rnTlQKBOPMY'
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//   const [dataList, setDataList] = useState([]);
//   const [fromDate, setFromDate] = useState();
//   const [toDate, setToDate] = useState();
//   const [searchClicked, setSearchClicked] = useState(false);
//   const [form] = Form.useForm();

//   const fetchData = async (values: any) => {
//     const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
//     const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
//     try {
//       const response = await axios.post("/message-by-date", {
//         fromDate: fromDateValue,
//         toDate: toDateValue
//       });
//       setDataList(response.data.data || []);
//       return response
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const exportExcel = async (values: any) => {
//     const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
//     const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
//     try {
//       const response = await axios.post("/message-by-date/export-excel", {
//         fromDate: fromDateValue,
//         toDate: toDateValue
//       });
//       console.log('ttttttttttttttttttt', response);

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     if (searchClicked && fromDate && toDate) {
//       fetchData({ fromDate, toDate });
//       setSearchClicked(false);
//     }

//   }, [searchClicked, fromDate, toDate]);

//   const handleFromDateChange = (date: any) => { setFromDate(date); }
//   const handleToDateChange = (date: any) => { setToDate(date); }
//   const onFinish = (values: any) => { console.log('yyyyyyyyyyy', values); }
//   const onFinishFailed = (errorInfo: any) => {
//     console.log('fffffffffffffffff:', errorInfo);
//   };
//   const handleSearch = async () => {
//     setSearchClicked(true);
//   }
//   const handleOnclickExport = async () => {
//     await exportExcel({ fromDate, toDate });
//   }

//   const columns = [
//     { title: 'STT', dataIndex: 'indexs', width: 150, },
//     { title: 'MST TCGP', dataIndex: 'mstTcgp', width: 150, },
//     { title: 'Tổng số gửi lên', dataIndex: 'totalSentUp', },
//     { title: 'Tổng số trả về', dataIndex: 'totalReturn', },
//     { title: 'Tổng cộng', dataIndex: 'total', }
//   ];

//   const data = (dataList as { MstTcgp: string, totalSentUp: number, totalReturn: number, total: number }[]).map((item, index) => ({
//     indexs: index + 1,
//     mstTcgp: item.MstTcgp,
//     totalSentUp: item.totalSentUp || 0,
//     totalReturn: item.totalReturn || 0,
//     total: item.total,
//   }));

//   return (
//     <div>
//       <Form
//         form={form}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         style={{ width: '100%', backgroundColor: 'white', border: '1px solid #ccc', position: 'relative', borderRadius: '2px' }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 5px' }}>
//           <div>
//             <h3 style={{ margin: 0 }}>1. TỔNG HỢP THÔNG ĐIỆP</h3>
//           </div>
//           <div>
//             <Button
//               style={{
//                 backgroundColor: 'rgb(40, 167, 69)',
//                 border: 'none',
//                 padding: '5px 10px',
//                 borderRadius: '3px',
//                 color: 'white',
//                 marginRight: '8px',
//               }}
//               htmlType="submit"
//               onClick={handleSearch}
//             >
//               Tìm kiếm
//             </Button>
//             <Button
//               style={{
//                 backgroundColor: 'rgb(40, 167, 69)',
//                 border: 'none',
//                 padding: '5px 10px',
//                 borderRadius: '3px',
//                 color: 'white',
//               }}
//               htmlType='submit'
//               onClick={handleOnclickExport}
//             >
//               Export excel
//             </Button>
//           </div>
//         </div>
//         <div style={{ border: '1px solid #ccc', width: '99%', borderRadius: '3px', margin: 'auto 6px' }}>
//           <div style={{ width: '60%', display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
//             <Form.Item label="Từ ngày" name="fromDate" initialValue={fromDate}>
//               <DatePicker format={'YYYY/MM/DD'} onChange={handleFromDateChange} />
//             </Form.Item>
//             <Form.Item label="Đến ngày" name="toDate" initialValue={toDate}>
//               <DatePicker format={'YYYY/MM/DD'} onChange={handleToDateChange} />
//             </Form.Item>
//           </div>
//         </div>
//         <Table
//           columns={columns}
//           dataSource={data}
//           pagination={{
//             pageSize: 20,
//             style: {
//               position: 'absolute', top: '400px', right: '15px'
//             },
//           }}
//           scroll={{ y: 360 }}
//           style={{ border: '1px solid #ccc', width: '70%', minHeight: '450px', margin: '10px 6px', borderRadius: '3px' }}
//         />
//       </Form>
//     </div>
//   );
// };
// export default ListTaxCodeOfSolutionOrganization;



