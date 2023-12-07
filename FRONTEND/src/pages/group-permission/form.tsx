import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { message as $message } from 'antd';
import { useLocale } from '@/locales';
import { useForm } from 'antd/es/form/Form';
import MinvoiceModal from '@/components/core/modal';
import type { FormProps } from 'antd/es/form';
import type { ControlTypes, MinvoiceFormItemProps } from '@/components/core/form-item';
import { MenuPermission, GroupPermission, GroupPermissionFullModel } from '@/interface/group-permission/group.interface';
import { createGroupPermission, getGroupPermissionByCode, updateGroupPermission } from '@/api/system/group-api';
import MenuPermissionTree from './menus-permission-tree/menu-permission-table';
import { getMenuAll } from '@/api/system/menu-api';
import { RowSelectMethod } from 'antd/es/table/interface';
import { treeToList } from '../../utils/function-extensions'
interface GroupPermissionModalProps {
    isShowModal: boolean,
    onClose?: (record?: any) => any;
    editMode?: number,
    getData: () => any,
    rowGroupPermission?: GroupPermissionFullModel | GroupPermission
}

const GroupPermissionFormModal: FC<GroupPermissionModalProps> = (props: GroupPermissionModalProps) => {
    const { formatMessage } = useLocale();
    const { isShowModal, onClose, editMode, getData, rowGroupPermission, ...rest } = props;
    const [menuPermissionList, setMenuPermissionList] = useState<MenuPermission[]>([]);
    const [selectedMenuPermissionKeys, setSelectedMenuPermissionKeys] = useState<string[]>([]);
    const [formInstance] = useForm<GroupPermissionFullModel>();

    const getMenu = async (groupPermission: GroupPermission | null) => {
        const { result, status } = await getMenuAll();
        status && setMenuPermissionList(result.data.map(menu => {
            let foundMenu = groupPermission?.menus.find(groupMenuPermission => menu._id === groupMenuPermission._id);
            setSelectedMenuPermissionKeys(groupPermission?.menus.map(m => m._id) ?? [])
            return {
                ...menu,
                search: foundMenu?.search ?? false,
                exportExcel: foundMenu?.exportExcel ?? false,
                viewXml: foundMenu?.viewXml ?? false,
                getXml: foundMenu?.getXml ?? false
            }
        }))
    }
    useEffect(() => {
        switch (editMode) {
            case 1: {
                getMenu(null);
                formInstance.setFieldsValue(rowGroupPermission ?? {}); break;
            }
            case 2: {
                getGroupPermissionByCode(rowGroupPermission!.code)
                    .then(res => {
                        formInstance.setFieldsValue(res.result.data)
                        getMenu(res.result.data);
                    })
                    .catch(console.error);
                break;
            }
        }
    }, [editMode, rowGroupPermission])

    const onMenuPermissionSelectChange: (selectedKeys: React.Key[], selectedRows: MenuPermission[], info: { type: RowSelectMethod }) => void = (selectedKeys, selectedRows, { type }) => {
        setSelectedMenuPermissionKeys(selectedKeys.map(v => v.toString()) ?? []);
    }
    const onMenuPermissionRowChange: (record: MenuPermission) => void = (record) => {
        const newMenuPermissionList = menuPermissionList.map((m) => { return m._id === record._id ? record : m })
        setMenuPermissionList(newMenuPermissionList)
    }

    const onOk = async () => {
        await formInstance.validateFields()
            .then(async (values) => {

                var menuFlat: any[] = [];
                treeToList(menuPermissionList, "children", menuFlat);
                values.menus = menuFlat.filter(m => selectedMenuPermissionKeys.includes(m._id));
                switch (editMode) {
                    case 1:
                        var { status, result } = await createGroupPermission(values);
                        status && $message.success("Thêm mới nhóm quyền thành công");
                        status && onClose?.();
                        status && getData();
                        break;
                    case 2:
                        var { status, result } = await updateGroupPermission(values?.code, values!);
                        status && $message.success("Sửa nhóm quyền thành công");
                        status && onClose?.();
                        status && getData();
                        break;
                };
            }).catch((errors) => {
                let mess = "";
                errors.errorFields.forEach((element: any) => { mess += element.errors + "\n"; })
                $message.error(mess);
            });
    };
    const fileldOptions: Array<MinvoiceFormItemProps<ControlTypes>> = [
        {
            type: 'input',
            label: 'Group code',
            name: 'code',
            required: true,
            innerprops: { disabled: editMode != 1 }
        },
        { type: 'input', label: 'Group name', name: 'name', required: true, },
    ]
    const frm: FormProps<object> =
    {
        name: "groupPermissionForm",
        labelAlign: "left",
        labelCol: { span: 4 }
    }

    return (
        <MinvoiceModal
            {...rest}
            open={isShowModal}
            destroyOnClose={true}
            title={editMode === 1 ? `Thêm mới nhóm quyền` : `Sửa nhóm quyền ${rowGroupPermission?.name}`}
            form={frm}
            formProps={frm}
            formInstance={formInstance}
            onClose={onClose}
            onOk={onOk}
            fieldOptions={fileldOptions}>
            <MenuPermissionTree
                selectedKeys={selectedMenuPermissionKeys ?? []}
                menus={menuPermissionList}
                onMenuPermissionSelectChange={onMenuPermissionSelectChange}
                onMenuPermissionRowDataChange={onMenuPermissionRowChange}
            >
            </MenuPermissionTree>
        </MinvoiceModal>
    );
};

export default GroupPermissionFormModal;
