import type { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { UserData, ModelGetData, docsUser, ModelUser } from '../../interface/user/user.interface';
import { useEffect, useState } from 'react';
import { Tag, Popconfirm, Checkbox, message as $message } from 'antd';
import { apiGetUsers, apiDeleteUsers } from '@/api/system/users-api';
import { useLocale } from '@/locales';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserFormModal from './user-form';
import MinvoiceTable from '@/components/core/table';
import MinvoiceButton from '@/components/basic/button';
import './index.less';

interface UserColumnType {
  _id: string;
  username: String;
  name: String;
  email: String;
  active: boolean;
  role: String;
}
const UserTalbePage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [entities, setEntities] = useState<docsUser[]>([]);
  const [userRecord, setUserRecord] = useState<ModelUser>();
  const [editMode, setEditMode] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRowsCount, setTotalRowsCount] = useState<number>();
  const { formatMessage } = useLocale();

  const getData = async (varPage: number, varPageSize: number) => {
    const initialValues: ModelGetData = {
      page: varPage,
      size: varPageSize,
      // remember: true
    };
    setLoading(true);
    const { status, result } = await apiGetUsers(initialValues);
    setLoading(false);
    status && setTotalRowsCount(result.totalDocs);
    status && setUserData(result);
    status && setEntities(result.docs);
  };

  const changePage = (varPage: number, varPageSize: number) => {
    getData(varPage - 1, varPageSize);
  };

  const toggleModal = () => {
    setIsShowModal(!isShowModal);
  }

  const onAdd = () => {
    const initialValues: ModelUser = {
      username: "",
      password: "",
      email: "",
      name: "",
      active: false
    };
    setUserRecord(initialValues);
    setEditMode(1);
    toggleModal();
  };

  const onEdit = (record: any) => {
    setUserRecord(record);
    setEditMode(2);
    toggleModal();
  };

  const onDelete = async (id: any) => {
    const { status, result } = await apiDeleteUsers(id);
    status && $message.success(formatMessage({ id: 'user.delete.success' }));
    status && await getData(0, pageSize);
  }

  useEffect(() => {
    getData(0, pageSize);
  }, []);

  const columns: ColumnsType<UserColumnType> = [
    {
      title: 'Actions', dataIndex: 'actions', key: 'actions', render: (_, record) =>
        <>
          <EditOutlined onClick={() => onEdit(record)} />
          <Popconfirm title={`${formatMessage({ id: 'user.delete', })}`} onConfirm={() => onDelete(record._id)}>
            <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
          </Popconfirm>
        </>
    },
    { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <a>{text}</a>, },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    {
      title: 'Role', dataIndex: 'role', key: 'role', render:
        (_, { role }) => <><Tag color={role.toString().includes("user") ? 'geekblue' : 'green'} >{role}</Tag></>
    },
    {
      title: 'Active', dataIndex: 'active', key: 'active', render:
        (_, { active }) => <><Checkbox checked={active ?? false}></Checkbox></>
    }
  ]

  return (
    <div className="user-data">
      <MinvoiceButton onClick={onAdd} className='button-user'>Thêm mới</MinvoiceButton>
      <MinvoiceButton onClick={() => getData(0, pageSize)}>Tải lại</MinvoiceButton>
      <MinvoiceTable<UserColumnType>
        dataSource={entities == undefined ? [] : entities}
        loading={loading}
        rowKey={record => record._id}
        columns={columns}
        pagination={{
          size: "default",
          pageSize: pageSize,
          showTotal: (total, range) => `Từ ${range[0]}-${range[1]} tổng số ${total} bản ghi`,
          onChange: changePage,
          total: totalRowsCount,
          showSizeChanger: true
        }}>
      </MinvoiceTable>
      <UserFormModal isShowModal={isShowModal} onClose={toggleModal} editMode={editMode} userRecord={userRecord} getData={getData} ></UserFormModal>
    </div>
  );
};

export default UserTalbePage;
