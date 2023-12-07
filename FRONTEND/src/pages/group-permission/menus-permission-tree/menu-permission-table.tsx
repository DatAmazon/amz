import { Checkbox, Badge, Table } from "antd";
import { FC, useState, useEffect } from "react";
import { MenuPermission } from "@/interface/group-permission/group.interface";
import MinvoiceTable from "@/components/core/table";
import { ColumnsType } from "antd/es/table";
import { RowSelectMethod, TableRowSelection } from "antd/es/table/interface";
import '../index.less'

const MenuPermissionTree: FC<{
    selectedKeys: string[],
    menus: MenuPermission[],
    onMenuPermissionSelectChange: (selectedRowKeys: React.Key[], selectedRows: MenuPermission[], info: { type: RowSelectMethod }) => void
    onMenuPermissionRowDataChange: (menuPermissionRow: MenuPermission) => void
}> = ({ selectedKeys, menus, onMenuPermissionSelectChange, onMenuPermissionRowDataChange }) => {

    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const checkBoxRender: (value: any, record: MenuPermission, index: number, onChange: (value: any) => void) => React.ReactNode = (value, record, index, onChange) => {
        return (
            <Checkbox
                disabled={selectedKeys.every((value) => value !== record._id)}
                checked={value}
                onChange={({ target }) => { onChange(target.checked) }}
            >
            </Checkbox >
        )
    }

    const menuNameRender: (value: any, record: MenuPermission, index: number) => React.ReactNode = (value, record) => {
        return <span>{value.en_US}</span>
    }
    const columns: ColumnsType<MenuPermission> = [
        {
            title: 'Menu', dataIndex: 'menuName', key: 'menuName',
            render: menuNameRender
        },
        {
            title: 'Search', dataIndex: 'search', key: 'search',
            render: (value, record, index) => {
                return checkBoxRender(value, record, index, (v) => { record.search = v; onMenuPermissionRowDataChange(record) })
            },
        },
        {
            title: 'Export excel', dataIndex: 'exportExcel', key: 'exportExcel',
            render: (value, record, index) => {
                return checkBoxRender(value, record, index, (v) => { record.exportExcel = v; onMenuPermissionRowDataChange(record) })
            },
        },
        {
            title: 'Get XML', dataIndex: 'getXml', key: 'getXml',
            render: (value, record, index) => {
                return checkBoxRender(value, record, index, (v) => { record.getXml = v; onMenuPermissionRowDataChange(record) })
            },
        },
        {
            title: 'View XML', dataIndex: 'viewXml', key: 'viewXml',
            render: (value, record, index) => {
                return checkBoxRender(value, record, index, (v) => { record.viewXml = v; onMenuPermissionRowDataChange(record) })
            },
        },
    ]
    const rowSelectionProps: TableRowSelection<MenuPermission> | undefined = {
        type: 'checkbox',
        getCheckboxProps: (record: MenuPermission) => ({
            name: record._id
        }),
        onChange: onMenuPermissionSelectChange,
        selectedRowKeys: selectedKeys,
        checkStrictly: false
    }
    useEffect(() => {
        const ids = menus.filter((values) => values.children).map((values) => values._id);
        setExpandedRowKeys(ids);
    }, [menus]);

    return (
        <MinvoiceTable<MenuPermission>
            expandable={{
                defaultExpandAllRows: true,
                rowExpandable: () => true,
                expandedRowKeys,
                onExpand: (expandable, record) => {
                    if (expandable)
                        setExpandedRowKeys([...expandedRowKeys, record._id]);
                    else
                        setExpandedRowKeys(expandedRowKeys.filter((id) => record._id !== id));
                }
            }}
            columns={columns}
            dataSource={menus}
            rowKey={(record) => record._id}
            pagination={false}
            rowSelection={rowSelectionProps}
        ></MinvoiceTable>
    )
}

export default MenuPermissionTree;