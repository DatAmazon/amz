import type { ButtonProps } from 'antd/es/button';
import type { FC } from 'react';
import { Button } from 'antd';

interface MinvoiceButtonProps extends ButtonProps {}

const BaseButton: FC<MinvoiceButtonProps> = props => {
  return <Button {...props} />;
};

const MinvoiceButton = Object.assign(Button, BaseButton);

export default MinvoiceButton;
