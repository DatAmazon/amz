import type { FC } from 'react';
import React, { useState } from 'react';
import { Input, Form, message as $message } from 'antd';
import { useLocale } from '@/locales';
import { useForm } from 'antd/es/form/Form';
import { apiCreateUsers, apiDeleteUsers } from '@/api/system/users-api';
import MinvoiceModal, * as mModal from '@/components/core/modal';
import type { FormProps } from 'antd/es/form';
import type { ControlTypes, MinvoiceFormItemProps } from '@/components/core/form-item';
import type { ModelCreate } from '../../interface/user/user.interface';

type FormValues = {
    _id?: string;
    username: String;
    name: String;
    email: String;
    active: Boolean;
    role: String;
}
interface UserProps {
    isShowModal: boolean,
    onClose?: (record?: any) => any;
    editMode?: number
}

const UserFormModal: FC<UserProps> = (props: UserProps) => {
    const { isShowModal, onClose, editMode, ...rest } = props;
    const [loading, setLoading] = useState(false);
    const { formatMessage } = useLocale();

    const [formInstance] = useForm<ModelCreate>();

    const onOk = async () => {
        await formInstance.validateFields()
            .then(async (values) => {
                switch (editMode) {
                    case 1:
                        let { status, result } = await apiCreateUsers(values);
                        status && $message.success("Thêm mới tài khoản thành công");
                        status && onClose?.();
                        break;
                    case 2:
                        break;
                };
            }).catch((errors) => {
                let mess = "";
                errors.errorFields.forEach((element: any) => {
                    mess += element.errors + "\n";
                })
                $message.error(mess);
            });
    };

    const fileldOptions: Array<MinvoiceFormItemProps<ControlTypes>> = [
        { type: 'input', label: 'Tài khoản', name: 'username', required: true },
        { type: 'input', label: 'Mật khẩu', name: 'password', required: true, },
        { type: 'input', label: 'Email', name: 'email', required: true },
        { type: 'input', label: 'Tên tài khoản', name: 'name', required: true },
        {
            type: 'select', label: 'Role', name: 'role',
            options: [
                { label: 'admin', value: 'admin' },
                { label: 'user', value: 'user' }
            ],
        },
        { type: 'checkbox', label: 'Sử dụng', name: 'active' },
    ]
    const frm: FormProps<object> =
    {
        name: "userForm",
        labelAlign: "left",
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
            title={editMode === 1 ? `Thêm mới tài khoản` : `Sửa tài khoản`}
            form={frm}
            formProps={frm}
            formInstance={formInstance}
            onClose={onClose}
            onOk={onOk}
            fieldOptions={fileldOptions}>
        </MinvoiceModal>
    );
};

export default UserFormModal;
