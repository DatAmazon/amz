import type { ControlTypes, MinvoiceFormItemProps } from '../form-item';
import type { FormProps } from 'antd/es/form/Form';
import { Form } from 'antd';
import MinvoiceformItem from '../form-item';
import React from 'react';

export interface MyFormOptions extends Array<MinvoiceFormItemProps<ControlTypes>> { }
export interface MyFormProps<T> extends FormProps<T> {
  fieldOptions?: MyFormOptions;
}

const BaseForm = <Values extends object>(props: MyFormProps<Values>) => {
  const { fieldOptions, children, ...rest } = props;

  /**React.Children.toArray tự động gán keys duy nhất cho các phần tử con */
  return (
    <Form<Values> {...rest}>
      {React.Children.toArray(fieldOptions?.map(option => {
        return <MinvoiceformItem {...option} />;
      }))}
      {children}
    </Form>
  );
};

const MinvoiceForm = Object.assign(BaseForm, Form, { Item: MinvoiceformItem });

export default MinvoiceForm;
