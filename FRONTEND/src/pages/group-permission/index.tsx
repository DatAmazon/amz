import type { FC } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';

import MinvoiceTable from '@/components/core/table';
import MinvoiceButton from '@/components/basic/button';
import './index.less';
import { deleteGroupPermission, getGroupPermission } from '@/api/system/group-api';
import { GroupPermission, GroupPermissionFullModel, GroupPermissionQuery } from '@/interface/group-permission/group.interface';
import { MongoQueryResponseModel } from '@/interface/base/api.interface';
import RecordButton from './menus-permission-tree/record-buttons';
import GroupPermissionFormModal from './form';

const UserTalbePage: FC = () => {

  const [isShowModal, setIsShowModal] = useState(false);
  const [entities, setEntities] = useState<MongoQueryResponseModel<GroupPermissionFullModel>>();
  const [query, setQuery] = useState<GroupPermissionQuery>({ page: 0, size: 10 });
  const [selectingRow, setSelectingRow] = useState<GroupPermission | GroupPermissionFullModel>();
  const [editMode, setEditMode] = useState<1 | 2>(1);
  const { formatMessage } = useLocale();

  const getData = async () => {
    const { status, result } = await getGroupPermission(query);
    status && setEntities(result);
  };
  const tableOnChange = (page: number, pageSize: number) => {
    setQuery({
      ...query,
      page: page - 1,
      size: pageSize
    })
  }

  const toggleModal = () => {
    setIsShowModal(!isShowModal);
  }

  const onAdd = useCallback(() => {
    const initialValues: GroupPermission = {
      code: "",
      name: "",
      menus: []
    };
    setSelectingRow(initialValues)
    setEditMode(1);
    toggleModal();
  }, []);

  const onEdit = useCallback((code: string, record: GroupPermissionFullModel) => {
    setSelectingRow(record);
    setEditMode(2);
    toggleModal();
  }, []);

  const onDelete = useCallback(async (code: string) => {
    const { status, result } = await deleteGroupPermission(code);
    status && $message.success(formatMessage({ id: 'groupPermission.delete.success' }));
    status && await getData();
  }, [])

  useEffect(() => {
    getData();

  }, [JSON.stringify(query)]);

  const actionBtnRender: (_: any, record: GroupPermissionFullModel) => JSX.Element = (_, record) => {
    return <RecordButton
      onDeleteCallback={onDelete}
      onEditCallback={onEdit}
      record={record}></RecordButton>
  }
  const columns: ColumnsType<GroupPermissionFullModel> = [
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: actionBtnRender
    },
    { title: 'Group code', dataIndex: 'code', key: 'code' },
    { title: 'Group name', dataIndex: 'name', key: 'name' },
  ]
  const formatTableTotal: (total: number, range: [number, number]) => string = (total, range) => {
    return `Từ ${range[0]}-${range[1]} tổng số ${total} bản ghi`
  }
  const tablePagination: false | TablePaginationConfig | undefined = {
    size: "default",
    pageSize: query.size,
    showTotal: formatTableTotal,
    onChange: tableOnChange,
    total: entities?.totalDocs,
    showSizeChanger: true
  }

  return (
    <div className="user-data">
      <MinvoiceButton onClick={getData}>Tải lại</MinvoiceButton>
      <MinvoiceButton onClick={onAdd} className='button-user'>Thêm mới</MinvoiceButton>
      <MinvoiceTable<GroupPermissionFullModel>
        dataSource={entities?.docs}
        rowKey={record => record._id}
        columns={columns}
        pagination={tablePagination}>
      </MinvoiceTable>
      <GroupPermissionFormModal
        isShowModal={isShowModal}
        onClose={() => { toggleModal() }}
        editMode={editMode}
        getData={getData}
        rowGroupPermission={selectingRow} >
      </GroupPermissionFormModal>
    </div>
  );
};

export default UserTalbePage;
