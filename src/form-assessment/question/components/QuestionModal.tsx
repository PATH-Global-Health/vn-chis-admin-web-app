import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';

import { Modal, Form, TextArea, Checkbox, Button } from 'semantic-ui-react';
import AnswerTable from '@form-assessment/question/components/AnswerTable';

import { useFetchApi } from '@app/hooks';
import { Question, QuestionCM } from '@form-assessment/question/question.model';
import questionService from '@form-assessment/question/question.service';

interface Props {
  open: boolean;
  data?: Question;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<QuestionCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.description;
  const rules = {
    description: { required: 'Bắt buộc phải nhập mô tả' }
  };

  const onSubmit = async (d: QuestionCM): Promise<void> => {
    await fetch(
      data?.id 
      ? questionService.updateQuestion({
        ..._.omit(d, ['answers']),
        id: data.id,
      })
      : questionService.createQuestion(d)
    );
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <Modal open={open || Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Sửa ' : 'Tạo '} câu hỏi
      </Modal.Header>
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
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="isMultipleChoice"
              defaultValue={false}
              render={({ onChange, onBlur, value }): React.ReactElement => (
                <Form.Field
                  control={Checkbox}
                  label="Cho phép chọn nhiều đáp án"
                  checked={value}
                  onChange={() => onChange(!value)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          {!data?.id && (
            <Form.Group widths="equal">
              <Controller
                control={control}
                name="answers"
                defaultValue={[]}
                render={({ onChange }): React.ReactElement => (
                  <Form.Field
                    required
                    isCreate
                    control={AnswerTable}
                    onChange={onChange}
                  />
                )}
              />
            </Form.Group>
          )}
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
