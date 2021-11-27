/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Button, TextArea } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { QuestionTemplateTypeCM } from '@form-assessment/question-template-type/question-template-type.model';
import questionTemplateTypeService from '@form-assessment/question-template-type/question-template-type.service';

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
  } = useForm<QuestionTemplateTypeCM>({
    defaultValues: {},
  });

  const disabled = !!errors?.description?.message;

  const onSubmit = async (d: QuestionTemplateTypeCM): Promise<void> => {
    await fetch(questionTemplateTypeService.createQuestionTemplateType(d));
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('description', { required: 'Bắt buộc phải nhập mô tả' });
  }, [register]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
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

export default CreateModal;
