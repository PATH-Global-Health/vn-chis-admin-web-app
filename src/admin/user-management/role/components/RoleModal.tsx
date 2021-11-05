/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, TextArea, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { Role } from '@admin/user-management/role/role.model';
import roleService from '@admin/user-management/role/role.service';

interface Props {
  open: boolean;
  data?: Role;
  onClose: () => void;
  onRefresh: () => void;
}
const RoleModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh, data } = props;

  const {
    formState: { errors },
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<Role>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors?.name?.message;

  const onSubmit = async (d: Role): Promise<void> => {
    await fetch(
      data?.id
        ? roleService.updateRole({ ...d, id: data.id })
        : roleService.createRole(d),
    );
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên vai trò' });
    register('description');
  }, [register, watch]);

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <Modal open={open || Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>{data?.id ? 'Sửa đổi' : 'Tạo mới'}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên vai trò"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('name', value);
              }}
              onBlur={() => trigger('name')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={TextArea}
              label="Mô tả"
              value={watch('description') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('description', value);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          content="Xác nhận"
          loading={fetching}
          disabled={disabled}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default RoleModal;