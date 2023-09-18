import type { FC } from 'react';
import type { ModelUserById } from '../../interface/user/user.interface';
import { useEffect, useState } from 'react';
import { apiGetUsersInfo } from '@/api/system/users-api';
import { Badge, Descriptions, Spin } from 'antd';

const UserInfo: FC = () => {
    const [userData, setUserData] = useState<ModelUserById>();
    const getData = async () => {
        const { status, result } = await apiGetUsersInfo();
        status && setUserData(result);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <Descriptions title="Thông tin tài khoản"
                bordered
                column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}>
                <Descriptions.Item label="Tài khoản" span={2}> {userData?.data.username}</Descriptions.Item>
                <Descriptions.Item label="Email"> {userData?.data.email}</Descriptions.Item>
                <Descriptions.Item label="Name"> {userData?.data.name}</Descriptions.Item>
                <Descriptions.Item label="Role" span={2}> {userData?.data.role}</Descriptions.Item>
                <Descriptions.Item label="Active"><Badge status="processing" text="Active" /></Descriptions.Item>
            </Descriptions>
        </>
    )
};

export default UserInfo;