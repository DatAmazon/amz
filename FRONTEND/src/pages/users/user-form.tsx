import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Input, Form, message as $message } from 'antd';
import { useLocale } from '@/locales';
import { useForm } from 'antd/es/form/Form';
import { apiCreateUsers, apiGetUsersById, apiUpdateUsers } from '@/api/system/users-api';
import MinvoiceModal, * as mModal from '@/components/core/modal';
import type { FormProps } from 'antd/es/form';
import type { ControlTypes, MinvoiceFormItemProps } from '@/components/core/form-item';
import type { ModelUser } from '../../interface/user/user.interface';

interface UserProps {
    isShowModal: boolean,
    onClose?: (record?: any) => any;
    editMode?: number,
    getData: (varPage: number, varPageSize: number) => any,
    userRecord?: ModelUser
}

const UserFormModal: FC<UserProps> = (props: UserProps) => {
    const { isShowModal, onClose, editMode, userRecord, getData, ...rest } = props;
    const [loading, setLoading] = useState(false);
    const { formatMessage } = useLocale();

    const [formInstance] = useForm<ModelUser>();
    useEffect(() => {
        if (editMode == 1) {
            formInstance.setFieldsValue(userRecord ?? {});
        }
        if (editMode == 2) {
            const fetchData = async () => {
                let { status, result } = await apiGetUsersById(userRecord!._id);
                return result;
            }
            const result = fetchData().then(res => formInstance.setFieldsValue(res.data)).catch(console.error);;
        }
    }, [editMode, userRecord])

    const onOk = async () => {
        await formInstance.validateFields()
            .then(async (values) => {
                switch (editMode) {
                    case 1:
                        var { status, result } = await apiCreateUsers(values);
                        status && $message.success("Thêm mới tài khoản thành công");
                        status && onClose?.();
                        status && getData(0, 10);
                        break;
                    case 2:
                        var { status, result } = await apiUpdateUsers(userRecord?._id, values!);
                        status && $message.success("Sửa khoản thành công");
                        status && onClose?.();
                        status && getData(0, 10);
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
            type: 'input', label: 'Tài khoản', name: 'username', required: true,
            innerprops: { disabled: editMode == 1 ? false : true }
        },
        { type: 'password', label: 'Mật khẩu', name: 'password', required: true, },
        { type: 'input', label: 'Email', name: 'email', required: true },
        {
            type: 'input', label: 'Tên tài khoản', name: 'name', required: true
        },
        {
            type: 'select', label: 'Role', name: 'role',
            options: [
                { label: 'admin', value: 'admin' },
                { label: 'user', value: 'user' }
            ],
        },
        {
            type: 'checkbox', label: 'Sử dụng', name: 'active', valuePropName: 'active'
        },
    ]
    const frm: FormProps<object> =
    {
        name: "userForm",
        labelAlign: "left",
        labelCol: { span: 4 }
    }
    const children: React.ReactNode = [
        <>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </>
    ];

    return (
        <MinvoiceModal
            {...rest}
            open={isShowModal}
            title={editMode === 1 ? `Thêm mới tài khoản` : `Sửa tài khoản ${userRecord?.username}`}
            form={frm}
            formProps={frm}
            formInstance={formInstance}
            onClose={onClose}
            onOk={onOk}
            // initValues={userRecord}
            fieldOptions={fileldOptions}>
        </MinvoiceModal>
    );
};

export default UserFormModal;
