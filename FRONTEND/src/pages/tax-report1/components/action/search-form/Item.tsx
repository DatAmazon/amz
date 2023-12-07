import { Form } from 'antd'
import { FormItemLabelProps } from "antd/es/form/FormItemLabel";
import React, { FC } from 'react';

const SearchFormItem: FC<{ formItemProps: FormItemLabelProps, input: React.ReactNode }> = ({formItemProps, input}) =>{
    return <Form.Item {...formItemProps}>
        {input}
    </Form.Item>
}
export default SearchFormItem