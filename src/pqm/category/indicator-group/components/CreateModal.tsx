/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { IndicatorGroupCM } from '@pqm/category/indicator-group/indicator-group.model';
import indicatorGroupService from '@pqm/category/indicator-group/indicator-group.service';

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
  } = useForm<IndicatorGroupCM>({
    defaultValues: {},
  });

  const disabled = !!errors?.name?.message;

  const onSubmit = async (d: IndicatorGroupCM): Promise<void> => {
    const p: IndicatorGroupCM = {
      name: d.name,
      indicators: [],
    };

    await fetch(indicatorGroupService.createIndicatorGroup(p));
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên nhóm nguy cơ' });
  }, [register, watch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên nhóm chỉ số"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('name', value);
              }}
              onBlur={() => trigger('name')}
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
