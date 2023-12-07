import MinvoiceButton from "@/components/basic/button";
import { FC } from 'react'

const TaxReportExportButton: FC<{ exportCallback: () => void }> = ({ exportCallback}) =>{
    return (<MinvoiceButton onClick={exportCallback}>Kết xuất</MinvoiceButton>)
} 