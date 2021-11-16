import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Form, Input, Button, Checkbox, Grid, ButtonContent } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import QuestionService from '../question.service';
import { Question, QuestionCM, Answer } from '../question.model';

interface Props {
  open: boolean;
  data?: Question;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const [numberInput, setNumeberInput] = useState<number>(3);
  const [inputFields, setInputFields] = useState<any[]>([
    { id: uuidv4(), score: 0, description: '' }
  ]);
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<QuestionCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.description;

  const handleChangeInput = (id: any, payload: any, type: any) => {
    const newInputFields = inputFields.map(item => {
      if (id === item?.id) {
        item[type] = payload;
      }
      return item;
    })
    setInputFields(newInputFields);
  }
  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), score: 0, description: '' }])
  }
  const handleChange = (e: any) => setInputFields(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const onSubmit = async (d: QuestionCM): Promise<void> => {
    const answers = inputFields.map(item => {
      return {
        score: parseFloat(item?.score) ?? 0,
        description: item?.description ?? '',
      }
    });
    const data = { ...d, answers: answers };
    await fetch(
      QuestionService.createQuestion(data),
    );
    onRefresh();
    onClose();
  };

  useEffect(() => {
    register('description', { required: 'Bắt buộc nhập mô tả' });
    register('isElasticSynced');
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
        Loại biểu mẫu
      </Modal.Header>
      <Modal.Content>
        <Form loading={fetching}>
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
          <Form.Group widths="equal">
            <Form.Field
              name="isElasticSynced"
              control={Checkbox}
              label="Cho phép chọn nhiều đáp án"
              checked={watch('isElasticSynced') ?? undefined}
              onChange={(__: any) => {
                setValue('isElasticSynced', !watch('isElasticSynced'));
              }}
            />
          </Form.Group>
          {
            inputFields.map((inputField, index) => (
              <Form.Group >
                <Form.Field
                  control={Input}
                  label={`Lựa chọn ${index + 1}`}
                  width={14}
                  name={`description_${inputField.id}`}
                  onChange={(e: any, { value }: any) => handleChangeInput(inputField.id, value, 'description')}
                />
                <Form.Field
                  control={Input}
                  label="Điểm"
                  width={2}
                  name={`score_${inputField.id}`}
                  onChange={(e: any, { value }: any) => handleChangeInput(inputField.id, value, 'score')}
                />
              </Form.Group>
            ))
          }
          <Grid.Row >
            <Button content="Thêm lựa chọn" onClick={handleAddFields} />
          </Grid.Row>
          <Grid.Row style={{ display: 'flex', justifyContent: 'right' }} >
            <Button
              primary
              content="Xác nhận"
              disabled={disabled}
              onClick={handleSubmit((d) => onSubmit(d))}
            />
          </Grid.Row>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default CreateModal;
