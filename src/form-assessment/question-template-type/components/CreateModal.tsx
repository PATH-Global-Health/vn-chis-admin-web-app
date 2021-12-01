/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react';

import { Controller, useForm } from 'react-hook-form';
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
    control,
    reset,
    handleSubmit,
  } = useForm<QuestionTemplateTypeCM>();

  const disabled = !!errors?.description?.message;
  const rules = {
    description: { required: 'Bắt buộc phải nhập mô tả' }
  };

  const onSubmit = async (d: QuestionTemplateTypeCM): Promise<void> => {
    await fetch(questionTemplateTypeService.createQuestionTemplateType(d));
    onRefresh();
    onClose();
    reset({});
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
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

export default CreateModal;
