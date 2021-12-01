import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Modal, Form, Input, TextArea, Button } from 'semantic-ui-react';

// import { useFetchApi, useSelector } from '@app/hooks';
import { Answer, SingleAnwserCM, AnswerUM } from '@form-assessment/question/question.model';
// import questionService from '@form-assessment/question/question.service';

interface Props {
  open: boolean;
  data?: Answer;
  onChange: (d: SingleAnwserCM) => void;
  onClose: () => void;
  onRefresh: () => void;
}

const AnswerModal: React.FC<Props> = ({ open, data, onChange, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<SingleAnwserCM | AnswerUM>();

  // const { fetch, fetching } = useFetchApi();
  // const { selectedQuestion } = useSelector(
  //   (state) => state.formAssessment.question,
  // );

  const disabled = !!errors.description;
  const rules = {
    description: { required: 'Bắt buộc phải nhập mô tả lựa chọn' },
    score: {
      required: 'Bắt buộc phải nhập điểm',
      validate: (value: string) => (value || '').replace(/[^0-9]/g,'') !== '' ? true : 'Bắt buộc phải nhập số',
    },
  };

  const onSubmit = async (d: SingleAnwserCM): Promise<void> => {
    await onChange(d);
    onRefresh();
    onClose();
    reset({});
    // await fetch(
    //   data?.id
    //     ? questionService.updateAnswer({
    //       ...d,
    //       id: data?.id ?? '',
    //       score: parseFloat(d.score as unknown as string),
    //     })
    //     : questionService.createAnswer({
    //       questionId: selectedQuestion?.id ?? '',
    //       answers: [{
    //         ...d,
    //         score: parseFloat(d.score as unknown as string),
    //       }],
    //     }),
    // );
  };

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal open={open || Boolean(data)} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Sửa ' : 'Thêm '} câu hỏi
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="score"
              defaultValue=""
              rules={rules.score}
              render={({ onChange, onBlur, value }): React.ReactElement => (
                <Form.Field
                  required
                  type="number"
                  control={Input}
                  label="Điểm"
                  error={!!errors?.score?.message && errors.score.message}
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
          // loading={fetching}
          disabled={disabled}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AnswerModal;
