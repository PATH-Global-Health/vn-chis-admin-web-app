import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal, Form, Input, Button, TextArea } from 'semantic-ui-react';
import DataList from '@app/components/data-list';

import { SurveyResult, SurveyResultCM } from '@form-assessment/survey-result/survey-result.model';

interface ExtendSurveyResult extends SurveyResult {
  isNew: boolean;
  isDeleted: boolean;
}

interface Props {
  data: SurveyResult[];
  onChange: (d: ExtendSurveyResult[]) => void;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onChange: (d: SurveyResult) => void;
}

const SurveyResultModal: React.FC<ModalProps> = ({ open, onClose, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<ExtendSurveyResult>({
    defaultValues: {},
  });

  const disabled = !!errors.fromScore || !!errors.toScore || !!errors.description;

  const onSubmit = (d: SurveyResultCM) => {
    onChange({
      ...d,
      id: uuidv4(),
    });
    onClose();
    reset();
  }

  useEffect(() => {
    register('fromScore', {
      required: 'Bắt buộc nhập từ điểm',
      validate: (score) => score > watch('toScore') ? 'Từ điểm phải lớn hơn tới điểm' : true,
    });
    register('toScore', { required: 'Bắt buộc nhập đến điểm' });
    register('description', { required: 'Bắt buộc nhập mô tả' });
  }, [register, watch]);

  return (
    <Modal open={open} onClose={onClose}>
    <Modal.Header>
      Tạo kết quả
    </Modal.Header>
    <Modal.Content>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <Form.Group widths="equal">
          <Form.Field
            required
            type="number"
            control={Input}
            label="Từ điểm"
            error={errors?.fromScore?.message ?? false}
            value={watch('fromScore') || ''}
            onChange={(e: any, { value }: any) => {
              setValue('fromScore', value);
              trigger('fromScore');
            }}
          />
          <Form.Field
            required
            type="number"
            control={Input}
            label="Đến điểm"
            error={errors?.toScore?.message ?? false}
            value={watch('toScore') || ''}
            onChange={(e: any, { value }: any) => {
              setValue('toScore', value);
              trigger('toScore');
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            required
            control={TextArea}
            label="Đánh giá"
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
  )
}

const SurveyResultSection: React.FC<Props> = ({ data, onChange }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [surveyResultList, setSurveyResultList] = useState<ExtendSurveyResult[]>([]);

  useEffect(() => {
    if (data && data.length && data !== surveyResultList) {
      const _data = data.map((s) => ({
        ...s,
        isNew: false,
        isDeleted: false,
      }));

      if (_data !== surveyResultList) {
        setSurveyResultList((state) => _data.map((s) => ({
          ...s,
          isNew: false,
          isDeleted: false,
        })));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (surveyResultList && surveyResultList.length > 0) {
      onChange(surveyResultList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyResultList]);

  return (
    <>
      <DataList
        title="Xếp loại kết quả"
        data={(surveyResultList || []).filter((s) => !s.isDeleted)}
        listActions={[
          {
            title: 'Tạo xếp loại mới',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        itemActions={[
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              setSurveyResultList((state) =>
                state.reduce((r: ExtendSurveyResult[], s: ExtendSurveyResult): ExtendSurveyResult[] => {
                  if (s.id === d.id) {
                    return [...r, { ...s, isDeleted: true }];
                  }
                  return [...r, s];
                }, [])
              );
            },
          },
        ]}
        itemHeaderRender={(d): string => d.description}
        itemContentRender={(d): string => `Từ điểm ${d.fromScore} - Đến điểm ${d.toScore}`}
        getRowKey={(d): string => d.id}
      />

      <SurveyResultModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onChange={(d) => setSurveyResultList((state) =>
          ([...state, { ...d, id: uuidv4(), isNew: true, isDeleted: false }])
        )}
      />
    </>
  );
};

export default SurveyResultSection;