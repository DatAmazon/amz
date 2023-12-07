import type { FormProps } from 'antd/es/form';
import type { ModalProps } from 'antd/es/modal';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';

import MinvoiceForm, * as mForm from '../form';

interface FilteredModalProps extends Omit<ModalProps, 'onOk' | 'onCancel'> { }

export interface MyModalProps<FormValues> extends FilteredModalProps {
  form?: FormValues;
  formProps?: FormProps<FormValues>;
  fieldOptions?: mForm.MyFormOptions;
  formInstance?: any,
  initValues?: any,
  children?: React.ReactNode;
  onClose?: (formData?: FormValues) => any;
  onOk?: (formData?: FormValues) => any;
}

const BaseModal = <FormValues extends object>(props: MyModalProps<FormValues>) => {
  const { form, formProps, children, onClose, onOk, fieldOptions, formInstance, initValues, ...rest } = props;

  /**form=FormInstance form control được tạo bởi Form.useForm(). Tự động tạo khi không được cung cấp*/
  return (
    <Modal forceRender okText="Lưu" cancelText="Hủy bỏ" {...rest} onCancel={() => onClose?.()} onOk={() => onOk?.()}>
      {form ? (
        <MinvoiceForm initialValues={initValues} {...formProps} fieldOptions={fieldOptions} form={formInstance}>
          {children}
        </MinvoiceForm>
      ) : (
        children
      )}
    </Modal>
  );
};

BaseModal.defaultProps = {
  width: '1000px',
};

const MinvoiceModal = Object.assign(BaseModal, Modal);

export default MinvoiceModal;
