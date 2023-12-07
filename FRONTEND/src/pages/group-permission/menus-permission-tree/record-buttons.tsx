import { FC } from "react"
import { EditOutlined, DeleteOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Divider, Popconfirm } from "antd";
import { useLocale } from "@/locales";
import { GroupPermissionFullModel } from "@/interface/group-permission/group.interface";
type onEditCallbackType = (groupCode: string, groupPermission: GroupPermissionFullModel) => void
type onDeleteCallbackType = (groupCode: string) => void
const RecordButton: FC<{
    record: GroupPermissionFullModel,
    onEditCallback: onEditCallbackType,
    onDeleteCallback: onDeleteCallbackType,
}> = ({ record, onEditCallback, onDeleteCallback }) => {
    const { formatMessage } = useLocale();
    return (
        <>
            <EditOutlined onClick={() => onEditCallback(record.code, record)} />
            <Divider type='vertical'></Divider>
            <Popconfirm title={`${formatMessage({ id: 'groupPermission.delete', })}`} onConfirm={() => onDeleteCallback(record.code)}>
                <DeleteOutlined style={{ color: "red" }} />
            </Popconfirm>
        </>
    )
}
export default RecordButton