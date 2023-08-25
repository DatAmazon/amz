import type { FC } from 'react';
import React, { useState } from 'react';
import { Input, Form } from 'antd';
import { useLocale } from '@/locales';
import MinvoiceModal, * as mModal from '@/components/core/modal';
import type { FormProps } from 'antd/es/form';
import type { ControlTypes, MinvoiceFormItemProps } from '@/components/core/form-item';

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
}

const UserFormModal: FC<UserProps> = (props: UserProps) => {
    const { isShowModal, onClose, ...rest } = props;
    const [loading, setLoading] = useState(false);
    const { formatMessage } = useLocale();

    const fileldOptions: Array<MinvoiceFormItemProps<ControlTypes>> = [
        { type: 'input', label: 'Tài khoản', name: 'username', required: true },
        {
            type: 'input', label: 'Mật khẩu', name: 'password', required: true,
            // innerProps: {
            //     value: 'vvvvv',
            //     type: 'input'
            // }
        },
        {
            type: 'select', label: 'Role', name: 'role', required: true,
            options: [
                { label: 'admin', value: 'admin' },
                { label: 'user', value: 'user' }
            ],
        }
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
    const children: React.ReactNode = [
        <>
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </>
    ];

    return (
        <MinvoiceModal
            open={isShowModal}
            title="Tài khoản"
            form={frm} formProps={frm}
            onClose={onClose}
            fieldOptions={fileldOptions}>
        </MinvoiceModal>
    );
};

export default UserFormModal;
