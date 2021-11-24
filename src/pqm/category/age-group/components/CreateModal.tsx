/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { AgeGroupCM } from '@pqm/category/age-group/age-group.model';
import ageGroupService from '@pqm/category/age-group/age-group.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  const { fetch, fetching } = useFetchApi();
  const {
    formState: { errors },
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<AgeGroupCM>({
    defaultValues: {},
  });

  const disabled =
    !!errors?.name?.message || !!errors?.from?.message || !!errors?.to?.message;

  const onSubmit = async (d: AgeGroupCM): Promise<void> => {
    const p: AgeGroupCM = {
      name: d.name,
    };

    if (d?.from) {
      p.from = parseInt((d.from as unknown) as string, 10);
    }

    if (d?.to) {
      p.to = parseInt((d.to as unknown) as string, 10);
    }

    if (d?.order) {
      p.order = parseInt((d.order as unknown) as string, 10);
    } else {
      p.order = 0;
    }

    await fetch(ageGroupService.createAgeGroup(p));
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên nhóm tuổi' });
    register('from', {
      validate: (from) =>
        typeof from !== 'undefined'
          ? from < 0
            ? 'Bắt buộc phải nhập số dương'
            : true
          : true,
    });
    register('to', {
      validate: (to) =>
        typeof to !== 'undefined'
          ? to < 0
            ? 'Bắt buộc phải nhập số dương'
            : true
          : true,
    });
    register('order');
  }, [register, watch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group>
            <Form.Field
              required
              width={10}
              control={Input}
              label="Tên nhóm tuổi"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('name', value);
              }}
              onBlur={() => trigger('name')}
            />
            <Form.Field
              width={6}
              type="number"
              control={Input}
              label="Thứ tự"
              onChange={(__: any, { value }: any) => {
                setValue('order', value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="number"
              control={Input}
              label="Từ"
              error={!!errors?.from?.message && errors.from.message}
              value={watch('from') ?? 0}
              onChange={(__: any, { value }: any) => {
                setValue('from', value);
              }}
              onBlur={() => trigger('from')}
            />
            <Form.Field
              type="number"
              control={Input}
              label="Đến"
              error={!!errors?.to?.message && errors.to.message}
              value={watch('to') ?? 0}
              onChange={(__: any, { value }: any) => {
                setValue('to', value);
              }}
              onBlur={() => trigger('to')}
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

export default CreateModal;
