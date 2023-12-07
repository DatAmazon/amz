import type { LoginParams } from '@/interface/user/login.interface';
import type { FC } from 'react';

import './index.less';
import MinvoiceLogo from '@/assets/logo/minvoice_vertical.svg';
import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/format-search';
import { loginAsync } from '../../stores/users/user.action';

const initialValues: LoginParams = {
  username: '',
  password: '',
  // remember: true
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onFinished = async (form: LoginParams) => {
    const res = Boolean(await dispatch(loginAsync(form)));
    if (res) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };
      navigate(from);
    }
  };

  return (
    <div className="login-page">
      <Form<LoginParams> layout="vertical" onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <img src={MinvoiceLogo} style={{objectFit:"contain", width:"100%", height:"100%"}} alt="" />
        <Form.Item hasFeedback label="Tài khoản" name="username" rules={[{ required: true, message: formatMessage({ id: 'gloabal.tips.enterUsernameMessage', }), },]}>
          <Input prefix={<UserOutlined />} placeholder={formatMessage({ id: 'gloabal.tips.username', })} />
        </Form.Item>
        <Form.Item hasFeedback label="Mật khẩu" name="password" rules={[{ required: true, message: formatMessage({ id: 'gloabal.tips.enterPasswordMessage', }), },]}>
          <Input.Password prefix={<LockOutlined />} type="password" placeholder={formatMessage({ id: 'gloabal.tips.password', })}/>
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>
            <LocaleFormatter id="gloabal.tips.rememberUser" />
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            <LocaleFormatter id="gloabal.tips.login" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
