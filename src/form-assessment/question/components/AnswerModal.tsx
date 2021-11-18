import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { AnswerCM } from '../question.model';
import QuestionService from '../question.service';
import { toast } from 'react-toastify';


interface Props {
  open: boolean;
  data?: any;
  onClose: () => void;
  onRefresh: () => void;
}

const AnswerModal: React.FC<Props> = ({ open, data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<AnswerCM>({
    defaultValues: {},
  });
  const {
    selectedQuestion,
  } = useSelector(
    (state) => state.formAssessment.question,
  );
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.description;

  const onSubmit = async (d: AnswerCM): Promise<void> => {
    const requestData = {
      questionId: selectedQuestion?.id,
      answers: [
        d
      ]
    }
    try {
      await fetch(
        data
          ? QuestionService.updateAnswer({
            ...d,
            id: data?.id ?? '',
          })
          : QuestionService.createAnswer(requestData),
      );
      toast.success('Thành công')
    } catch (error) {
      toast.warning('Thất bại')
    }
    onRefresh();
    onClose();
  };

  useEffect(() => {
    register('description', { required: 'Bắt buộc nhập mô tả lựa chọn' });
    register('score');
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
        {data?.id ? 'Sửa lựa chọn ' : 'Thêm lựa chọn mới '}
      </Modal.Header>
      <Modal.Content>
        <Form loading={fetching} onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Form.Group >
            <Form.Field
              control={Input}
              label="Mô tả"
              width={14}
              error={errors?.description?.message ?? false}
              value={watch('description') || ''}
              onChange={(e: any, { value }: any) => {
                setValue('description', value);
                trigger('description');
              }}
            />
            <Form.Field
              control={Input}
              label="Điểm"
              width={2}
              error={errors?.score?.message ?? false}
              value={watch('score') || 0}
              onChange={(e: any, { value }: any) => {
                setValue('score', parseFloat(value));
                trigger('score');
              }}
            />
          </Form.Group>
          <Button primary disabled={disabled} content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AnswerModal;
