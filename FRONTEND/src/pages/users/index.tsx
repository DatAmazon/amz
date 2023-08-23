import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Space, Tag, Popconfirm, Modal, Input, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import MinvoiceButton from '@/components/basic/button';
import MinvoiceTable from '@/components/core/table';
import { apiGetUsers } from '@/api/system/users-api';
import { useLocale } from '@/locales';
import MinvoiceModal, * as mModal from '@/components/core/modal';
import type { FormProps } from 'antd/es/form';
import type { UserData, GetDataParram, docsUser } from '../../interface/user/user.interface';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
const { Column, ColumnGroup } = MinvoiceTable;

interface UserColumnType {
  _id: string;
  username: String;
  name: String;
  email: String;
  active: Boolean;
  role: String;
}
type FormValues = {
  _id?: string;
  username: String;
  name: String;
  email: String;
  active: Boolean;
  role: String;
}
const UserTalbePage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [entities, setEntities] = useState<docsUser[]>([]);
  const { formatMessage } = useLocale();
  const initialValues: GetDataParram = {
    page: 0,
    size: 20,
    // remember: true
  };
  const getData = async () => {
    setLoading(true);
    const { status, result } = await apiGetUsers(initialValues);
    setLoading(false);
    status && setUserData(result);
    status && setEntities(result.docs);
  };

  const onDelete = (record: any) => {
    console.log(record);
  }
  const onEdit = (record: any) => {
    setIsEditing(true);
  };
  const resetEditing = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    getData();
  }, []);

  const columns: ColumnsType<UserColumnType> = [
    {
      title: 'Actions', dataIndex: 'actions', key: 'actions', render: (_, { _id }) =>
        <>
          <EditOutlined onClick={() => onEdit(_id)} />
          <Popconfirm title={`${formatMessage({ id: 'user.delete', })}`} onConfirm={() => onDelete(_id)}>
            <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
          </Popconfirm>
        </>
    },
    { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <a>{text}</a>, },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    {
      title: 'Role', dataIndex: 'role', key: 'role', render: (_, { role }) => (
        <>
          <Tag color={role.toString().includes("user") ? 'geekblue' : 'green'} >{role}</Tag>
        </>
      )
    },
  ]

  const frm: FormProps<object> =
  {
    name: "namdaica",
    labelAlign: "left",
  }
  const datav: FormValues = {
    active: true,
    email: "ccc",
    name: "nampv",
    username: "1812",
    role: "admin"
  }
  const child: React.ReactNode = [
    <>
      <Form.Item name="note" label="Note" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </>
  ];
  // {
  //   title: 'Actions', dataIndex: 'actions', key: 'actions', render: (_, { _id }) =>
  //     <>
  //       <EditOutlined onClick={() => onEdit(_id)} />
  //       <Popconfirm title={`${formatMessage({ id: 'user.delete', })}`} onConfirm={() => onDelete(_id)}>
  //         <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
  //       </Popconfirm>
  //     </>
  // },
  // { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <a>{text}</a>, },
  // { title: 'Email', dataIndex: 'email', key: 'email', },
  // {
  //   title: 'Role', dataIndex: 'role', key: 'role', render: (_, { role }) => (
  //     <>
  //       <Tag color={role.toString().includes("user") ? 'geekblue' : 'green'} >{role}</Tag>
  //     </>
  //   )
  // },

  return (
    <div className="user-data">
      <MinvoiceTable<UserColumnType> dataSource={entities == undefined ? [] : entities} loading={loading} rowKey={record => record._id} columns={columns}>
      </MinvoiceTable>
      <MinvoiceModal visible={isEditing} formProps={frm} onClose={resetEditing} children={child}></MinvoiceModal>
      {/* <Modal
        title="Edit Student"
        visible={isEditing}
        okText="Save"
        onCancel={() => { resetEditing(); }}
        onOk={() => { resetEditing(); }}
      >
        <Input title='Username' />
      </Modal> */}
    </div>
  );
};

export default UserTalbePage;
