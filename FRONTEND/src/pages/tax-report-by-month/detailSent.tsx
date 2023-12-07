import React, { useState, useEffect } from 'react';
import { Select, Button, Form, DatePicker, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import CommonUtils from '@/utils/commonUtils';
import { log } from 'console';

interface DataType {
  indexs: number;
  mstTcgp: string;
  MLTDiep: number;
  total: number;
}

const DetailSent: React.FC<DataType> = () => {
  axios.defaults.baseURL = 'http://localhost:8000/api/thongdiep';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDIxMzEyNTUsImlhdCI6MTcwMTkxNTI1NSwic3ViIjoiNjU1YzVmMDQwMDJlNGUwZTBjYWU2ZDUyIn0.R4obWYQJFUQ8fGNXXVV3ZTgobbc2R1XTtUy3me1gof4';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const [dataList, setDataList] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [searchClicked, setSearchClicked] = useState(false)
  const [form] = Form.useForm();

  const fetchData = async (values: any) => {
    try {
      const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
      const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
      const response = await axios.post('/detail-message-sent', {
        fromDate: fromDateValue,
        toDate: toDateValue,
      });
      setDataList(response.data.data || 0);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportExcel = async (values: any) => {
    const fromDateValue = values.fromDate ? values.fromDate.format('YYYY-MM-DD') : null;
    const toDateValue = values.toDate ? values.toDate.format('YYYY-MM-DD') : null;
    try {
      const response = await axios.post("/detail-message-sent/export-excel", {
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

  const handleFromDateChange = (date: any) => {
    setFromDate(date);
  };
  const handleToDateChange = (date: any) => {
    setToDate(date);
  };

  const handleSearch = async () => {
    setSearchClicked(true);
  };

  const handleExportExcel = async () => {
    await exportExcel({ fromDate, toDate, });
  };

  const columns = [
    { title: 'STT', dataIndex: 'indexs', width: 150, },
    { title: 'MST TCGP', dataIndex: 'mstTcgp', width: 150, },
    { title: 'Mã loại thông điệp', dataIndex: 'MLTDiep', },
    { title: 'Tổng số lượng', dataIndex: 'total', },
  ];

  const data = (dataList as {
    _id: any;
    count: number;
    MstTcgp: string;
    MLTDiep: number;
    total: number;
  }[]).map((item, index) => ({
    indexs: index + 1,
    mstTcgp: item.MstTcgp,
    MLTDiep: item.MLTDiep,
    total: item.total,
  }));

  return (
    <div>
      <Form
        form={form}
        style={{
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          position: 'relative',
          borderRadius: '2px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 5px' }}>
          <div>
            <h3 style={{ margin: 0 }}>2. CHI TIẾT GỬI LÊN</h3>
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
              onClick={handleExportExcel}
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
              position: 'absolute',
              top: '400px',
              right: '15px',
            },
          }}
          scroll={{ y: 600 }}
          style={{ border: '1px solid #ccc', width: '70%', minHeight: '450px', margin: '10px 6px', borderRadius: '3px' }}
        />
      </Form>
    </div>
  );
};

export default DetailSent;