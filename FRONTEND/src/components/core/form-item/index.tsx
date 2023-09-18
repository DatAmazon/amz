import type { FormItemProps } from 'antd/es/form';
import type { FC } from 'react';

import { Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import React, { useMemo } from 'react';

export type ControlTypes = 'input' | 'input-number' | 'switch' | 'date-picker' | 'checkbox' | 'checkbox-group' | 'radio' | 'select' | 'password';

type GetRCPropsType<T> = T extends (props: infer R) => any ? R : T extends React.ComponentClass<infer R> ? R : any;

type InnerProps = {
  input: GetRCPropsType<typeof Input>;
  'input-number': GetRCPropsType<typeof InputNumber>;
  switch: GetRCPropsType<typeof Switch>;
  'date-picker': GetRCPropsType<typeof DatePicker>;
  checkbox: GetRCPropsType<typeof Checkbox>;
  'checkbox-group': GetRCPropsType<typeof Checkbox>;
  radio: GetRCPropsType<typeof Radio>;
  select: GetRCPropsType<typeof Select>;
  'password': GetRCPropsType<typeof Input>;
};

export interface MinvoiceFormItemProps<T extends ControlTypes = ControlTypes> extends Omit<FormItemProps, 'required'> {
  type?: T;
  /** Các items cần dùng options, chẳng hạn như radio, checkbox, v.v., tùy chọn **/
  options?: {
    label: string;
    value: any;
    disabled?: boolean;
  }[];
  /** Thuộc tính bên trong của items(<Input innerProps>, <Checkbox innerProps> .....), tùy chọn **/
  innerprops?: InnerProps[T];
  required?: string | boolean;
}

export class ControlMap {
  props: MinvoiceFormItemProps;

  constructor(props: MinvoiceFormItemProps) {
    this.props = props;
  }

  get innerprops() {
    return this.props.innerprops as object;
  }

  input() {
    return <Input {...this.innerprops} />;
  }

  'password'() {
    return <Input.Password {...this.innerprops} />;
  }

  'input-number'() {
    return <InputNumber {...this.innerprops} />;
  }

  switch() {
    return <Switch {...this.innerprops} />;
  }

  'date-picker'() {
    return <DatePicker {...this.innerprops} />;
  }

  checkbox() {
    // highlight-next-line
    return <Checkbox children={this.props.children} {...this.innerprops} />;
  }

  'checkbox-group'() {
    // highlight-next-line
    return <Checkbox.Group children={this.props.children} options={this.props.options} {...this.innerprops} />;
  }

  radio() {
    // highlight-next-line
    return <Radio.Group children={this.props.children} options={this.props.options} {...this.innerprops} />;
  }

  select() {
    // highlight-next-line
    return <Select children={this.props.children} options={this.props.options} {...this.innerprops} />;
  }
}

const MinvoiceformItem: FC<MinvoiceFormItemProps> = props => {
  // Lấy ra các tham số tùy chỉnh của chúng tôi và trả lại phần còn lại cho `Form.Item` nguyên vẹn
  // type: Nó được sử dụng để chúng ta đánh giá loại điều khiển được truyền vào từ bên ngoài, chúng ta sẽ kết xuất và tạo ra nó một cách trực tiếp
  // children: Vì chúng ta cần tùy chỉnh các phần tử con của `Form.Item` nên nếu nó không được lấy ra mà được thành phần cha mẹ cung cấp thì sẽ xảy ra xung đột
  const { type, required, rules: userRules, ...restProps } = props;

  const rules = useMemo(() => {
    // Nếu đặt rules 
    if (userRules) return userRules;
    // Nếu đặt required
    if (required) {
      if (typeof required === 'boolean') {
        return [{ required: true, message: `${props.label} là trường bắt buộc nhập dữ liệu` }];
      }
      // Tùy chỉnh required cần thiết
      else if (typeof required === 'string') {
        return [{ required: true, message: required }];
      }
    }
  }, [required, userRules, props.label]);

  // highlight-next-line
  const controlMap = new ControlMap(props);

  return (
    <Form.Item {...restProps} rules={rules}>
      {type ? controlMap[type]() : props.children}
    </Form.Item>
  );
};

export default MinvoiceformItem;
