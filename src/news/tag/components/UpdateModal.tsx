/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
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
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<TagUM>({
    defaultValues: {},
  });

  const disabled = !!errors?.description?.message;

  const onSubmit = async (d: TagUM): Promise<void> => {
    if (data?.id) {
      await fetch(tagService.updateTag({ ...d, id: data.id}));
      onRefresh();
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    register('description', { required: 'Bắt buộc phải nhập mô tả' });
  }, [register]);


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
            <Form.Field
              required
              control={TextArea}
              label="Mô tả"
              error={!!errors?.description?.message && errors.description.message}
              value={watch('description') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('description', value);
              }}
              onBlur={() => trigger('description')}
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
