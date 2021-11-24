import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { FiArrowLeft, FiInfo } from 'react-icons/fi';
import { Card, Form, Input, Image, Message, Button } from 'semantic-ui-react';

import { useSelector } from '@app/hooks';
import authService from '@app/services/auth';

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
const ChangePasswordWrapper = styled.div`
  cursor: pointer;
  color: grey;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  padding: 0.25em 0.75em;

  &:hover {
    color: black;
  }
`;
const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

interface ChangePasswordModel {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const [failed, setFailed] = useState<any>(undefined);

  const {
    register,
    setValue,
    handleSubmit,
  } = useForm<ChangePasswordModel>();
  const history = useHistory();
  const { loginLoading, changePasswordLoading } = useSelector((state) => state.auth);

  const handleChangePassword = async (data: ChangePasswordModel): Promise<void> => {
    const { username, currentPassword, newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      setFailed({ message: 'Mật khẩu mới không khớp'});
      return;
    }

    try {
      const token = await authService.login(username, currentPassword);
      await authService.changePassword(token.access_token, { oldPassword: currentPassword, newPassword });
      setTimeout(() => history.push('/auth'), 0);
    } catch (error) {
      setFailed(error);
    }
  };

  useEffect(() => {
    register('username');
    register('currentPassword');
    register('newPassword');
    register('confirmPassword');
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
              ? 'Tài khoản hoặc mặt khẩu không đúng'
              : failed.message
            }
          />
        )}
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              label="Tên đăng nhập"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('username', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="password"
              label="Mật khẩu"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('currentPassword', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="password"
              label="Mật khẩu mới"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('newPassword', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="password"
              label="Nhập lại mật khẩu mới"
              control={Input}
              onChange={(__: any, { value }: any) => setValue('confirmPassword', value)}
            />
          </Form.Group>
          <ButtonWrapper widths="equal">
            <Form.Field
              fluid
              primary
              loading={loginLoading || changePasswordLoading}
              content="Đổi mật khẩu"
              control={Button}
              onClick={handleSubmit((d) => handleChangePassword(d))}
            />
          </ButtonWrapper>
          <ChangePasswordWrapper onClick={() => history.push('/login')}>
            <IconWrapper>
              <FiArrowLeft />
            </IconWrapper>
            Trở về đăng nhập
          </ChangePasswordWrapper>
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

export default ChangePasswordPage;
