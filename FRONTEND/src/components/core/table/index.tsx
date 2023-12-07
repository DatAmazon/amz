import type { TableProps } from 'antd';
import { css } from '@emotion/react';
import { Table } from 'antd';
import MinvoiceTableColumn from '../table-column';

interface MinvoiceTableProps<T extends object> extends TableProps<T> {
  height?: string;
}

const MinvoiceTable = <T extends object = object>(props: MinvoiceTableProps<T>) => {
  const { height, pagination, ...rest } = props;
  const defaultPagination = {
    size: 'default',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    defaultPageSize: 20
  };
  const combinedPagination = typeof pagination === 'object' ? { ...defaultPagination, ...pagination } : {};

  return (
    <div style={{ height }} css={styles}>
      <Table<T> {...rest} scroll={{ x: 'max-content', y: '100%' }} pagination={combinedPagination} />
    </div>
  );
};

MinvoiceTable.defaultProps = {
  size: 'small',
  height: 'auto',
} as MinvoiceTableProps<any>;

MinvoiceTable.Column = MinvoiceTableColumn;
MinvoiceTable.ColumnGroup = Table.ColumnGroup;

export default MinvoiceTable;

const styles = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-container {
    height: 100%;
  }
  .ant-table-body {
    overflow: hidden !important;
  }
  .ant-spin-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .ant-table {
      flex: 1;
      overflow: hidden;
      border-bottom: 1px solid #eee;

      .ant-table-container {
        display: flex;
        flex-direction: column;
        .ant-table-body {
          flex: 1;
          table {
            height: 100%;
          }
        }
      }
    }

    .ant-pagination {
      padding: 0 10px;
    }
  }
`;
