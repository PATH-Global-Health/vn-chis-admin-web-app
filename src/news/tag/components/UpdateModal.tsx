/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Modal, Form, Button, TextArea } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { Tag, TagUM } from '@news/tag/tag.model';
import tagService from '@news/tag/tag.service';

interface Props {
  data?: Tag;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  const { fetch, fetching } = useFetchApi();
  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<TagUM>({ defaultValues: data || {} });

  const disabled = !!errors?.description?.message;
  const rules = {
    description: { required: 'Bắt buộc phải nhập mô tả' }
  };

  const onSubmit = async (d: TagUM): Promise<void> => {
    if (data?.id) {
      await fetch(tagService.updateTag({ ...d, id: data.id}));
      onRefresh();
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Sửa đổi</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="description"
              defaultValue=""
              rules={rules.description}
              render={({ onChange, onBlur, value }): React.ReactElement => (
                <Form.Field
                  required
                  control={TextArea}
                  label="Mô tả"
                  error={!!errors?.description?.message && errors.description.message}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
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

export default UpdateModal;
