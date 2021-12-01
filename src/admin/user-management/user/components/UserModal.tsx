/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, Checkbox, Button } from 'semantic-ui-react';

import { useSelector, useFetchApi } from '@app/hooks';
import { validateEmpty } from '@app/utils/helpers';
import { UserCM } from '@admin/user-management/user/user.model';
import userService from '@admin/user-management/user/user.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const UserModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const {
    formState: { errors },
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<UserCM>({
    defaultValues: {},
  });

  const { fetch, fetching } = useFetchApi();
  const { getUsersLoading } = useSelector(
    (state) => state.admin.userManagement.user,
  );

  const disabled =
    !!errors?.username?.message ||
    !!errors?.password?.message ||
    !!errors?.fullName?.message ||
    !!errors?.email?.message ||
    !!errors?.phoneNumber?.message;
  const loading = fetching || getUsersLoading;

  const onSubmit = async (d: UserCM) => {
    await fetch(userService.createUser(d));
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('fullName', {
      validate: (fullName) =>
        validateEmpty(fullName, 'Bắt buộc phải nhập tên đăng nhập'),
    });
    register('email', {
      validate: (email: string): any => {
        if (
          email &&
          !/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(email)
        ) {
          return 'Email không đúng định dạng';
        }

        return true;
      },
    });
    register('phoneNumber', {
      validate: (phoneNumber: string): any => {
        if (!phoneNumber) {
          return 'Bắt buộc phải nhập số điện thoại';
        }
        const exec = /(\d+)/.exec(phoneNumber);
        if (exec === null || exec[0].length >= 11 || exec[0].length <= 10) {
          return 'Số điện thoại chưa đúng định dạng (10 - 11 số)';
        }
        return true;
      },
    });
    register('username', {
      validate: (username) =>
        validateEmpty(username, 'Bắt buộc phải nhập tên đăng nhập'),
    });
    register('password', {
      validate: (password) =>
        validateEmpty(password, 'Bắt buộc phải nhập mật khẩu'),
    });
    register('isElasticSynced');
  }, [register, watch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo người dùng</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Họ và tên"
              error={!!errors?.fullName?.message && errors.fullName.message}
              value={watch('fullName') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('fullName', value);
              }}
              onBlur={() => trigger('fullName')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Email"
              error={!!errors?.email?.message && errors.email.message}
              value={watch('email') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('email', value);
              }}
              onBlur={() => trigger('email')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Số điện thoại"
              error={
                !!errors?.phoneNumber?.message && errors.phoneNumber.message
              }
              value={watch('phoneNumber') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('phoneNumber', value);
              }}
              onBlur={() => trigger('phoneNumber')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              width={10}
              control={Input}
              label="Tên đăng nhập"
              error={!!errors?.username?.message && errors.username.message}
              value={watch('username') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('username', value);
              }}
              onBlur={() => trigger('username')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              type="password"
              control={Input}
              label="Mật khẩu"
              error={!!errors?.password?.message && errors.password.message}
              value={watch('password') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('password', value);
              }}
              onBlur={() => trigger('password')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              name="isElasticSynced"
              control={Checkbox}
              label="Đồng bộ"
              checked={watch('isElasticSynced') ?? undefined}
              onChange={(__: any) => {
                setValue('isElasticSynced', !watch('isElasticSynced'));
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          content="Xác nhận"
          loading={loading}
          disabled={disabled}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default UserModal;
