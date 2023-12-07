import { Form } from 'antd'
import React, {FC} from 'react'

const TaxReportSearchForm: FC<{items: React.ReactNode[]}> = ({items}) =>{
    return (
        <Form labelCol={{span: 4}} 
        wrapperCol={{span: 20}}>
            {items.map((item) => item)}
        </Form>)
}

export default TaxReportSearchForm