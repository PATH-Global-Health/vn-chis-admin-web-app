import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { Tag, TagCM } from '@news/tag/tag.model';
import tagService from '@news/tag/tag.service';

interface Props {
  open: boolean;
  data?: Tag;
  onClose: () => void;
  onRefresh: () => void;
}

const TagModal: React.FC<Props> = ({ open, data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<TagCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.description;

  const onSubmit = async (d: TagCM): Promise<void> => {
    await fetch(
      data
        ? tagService.updateTag({
          ...d,
          id: data?.id ?? '',
        })
        : tagService.createTag(d),
    );
    onRefresh();
    onClose();
  };

  useEffect(() => {
    register('description', { required: 'Bắt buộc nhập mô tả' });
  }, [register]);
  useEffect(() => {
    if (data) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal open={open || Boolean(data)} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Sửa ' : 'Tạo '}
        nhãn bài viết
      </Modal.Header>
      <Modal.Content>
        <Form loading={fetching} onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Mô tả"
              error={errors?.description?.message ?? false}
              value={watch('description') || ''}
              onChange={(e: any, { value }: any) => {
                setValue('description', value);
                trigger('description');
              }}
            />
          </Form.Group>
          <Button primary disabled={disabled} content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default TagModal;
