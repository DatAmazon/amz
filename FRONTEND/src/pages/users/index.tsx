import type { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { UserData, GetDataParram, docsUser } from '../../interface/user/user.interface';
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

  const toggleModal = () => {
    setIsShowModal(!isShowModal);
  }

  const onDelete = async (id: any) => {
    const { status, result } = await apiDeleteUsers(id);
    status && $message.success("Xóa thành công tài khoản");
    status && await getData();
  }

  const onEdit = (record: any) => {
    toggleModal();
  };

  const onAdd = () => {
    toggleModal();
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
      <MinvoiceButton onClick={getData}>Tải lại</MinvoiceButton>
      <MinvoiceTable<UserColumnType>
        dataSource={entities == undefined ? [] : entities}
        loading={loading}
        rowKey={record => record._id}
        columns={columns}>
      </MinvoiceTable>
      <UserFormModal isShowModal={isShowModal} onClose={toggleModal}></UserFormModal>
    </div>
  );
};

export default UserTalbePage;
