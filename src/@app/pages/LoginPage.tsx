import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { FiInfo } from 'react-icons/fi';
import { Card, Form, Input, Image, Message, Checkbox, Button } from 'semantic-ui-react';

import { useAuth, useSelector } from '@app/hooks';

import logo from '../assets/img/vk-logo.png';
import packageJson from '../../../package.json';

const StyledCard = styled(Card)`
  width: 450px !important;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const StyledImage = styled(Image)`
  background: white !important;
  padding: 16px !important;
`;
const ButtonWrapper = styled(Form.Group)`
  display: flex;
  flex-direction: row;
  margin: 2em -0.5em 0.25em !important;
`;
const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

interface LoginModel {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const [failed, setFailed] = useState<any>(undefined);

  const {
    register,
    setValue,
    handleSubmit,
  } = useForm<LoginModel>();
  const history = useHistory();
  const { login } = useAuth();
  const { loginLoading } = useSelector((state) => state.auth);

  const handleLogin = async (data: LoginModel): Promise<void> => {
    try {
      setFailed(undefined);
      const { username, password, remember } = data;
      await login(username, password, remember);
      setTimeout(() => history.push('/auth'), 0);
    } catch (error) {
      setFailed(error);
    }
  };

  useEffect(() => {
    window.document.title = 'CHIS-ADMIN';
  }, []);
  useEffect(() => {
    register('username');
    register('password');
    register('remember');
  }, [register]);

  return (
    <StyledCard>
      <StyledImage src={logo} size="large" />
      <Card.Content>
        {failed?.message && (
          <Message
            error
            content={
              failed.message.includes('400')
              ? 'T??i kho???n ho???c m???t kh???u kh??ng ????ng'
              : failed.message
            }
          />
        )}
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              placeholder="T??n ????ng nh???p"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('username', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="password"
              placeholder="M???t kh???u"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('password', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Nh??? m???t kh???u"
              control={Checkbox}
              onChange={(__: any, { value }: any) => setValue('remember', value)}
            />
          </Form.Group>
          <ButtonWrapper widths="equal">
            <Form.Field
              fluid
              primary
              loading={loginLoading}
              content="????ng nh???p"
              control={Button}
              onClick={handleSubmit((d) => handleLogin(d))}
            />
          </ButtonWrapper>
        </Form>
      </Card.Content>
      <Card.Content extra>
        <IconWrapper>
          <FiInfo />
        </IconWrapper>
        {packageJson.version}
      </Card.Content>
    </StyledCard>
  );
};

export default LoginPage;
