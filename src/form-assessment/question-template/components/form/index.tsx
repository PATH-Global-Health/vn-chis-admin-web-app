import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Form, Header, Input } from 'semantic-ui-react';
import { FiSave, FiX } from 'react-icons/fi';
import QuestionTemplateTypeSection from '@form-assessment/question-template/components/form/QuestionTemplateTypeSection';
// import TagSection from '@news/post/components/post-form/TagSection';
// import DescriptionSection from '@news/post/components/post-form/DescriptionSection';
// import PartSection from '@news/post/components/post-form/PartSection';
import Action from '@news/post/components/post-form/Action';

import { useSelector, useFetchApi, useConfirm } from '@app/hooks';
import { QuestionTemplate, QuestionTemplateCM } from '@form-assessment/question-template/question-template.model';
import questionTemplateService from '@form-assessment/question-template/question-template.service';

const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 8px 0;
`;
const StyledHeader = styled(Header)`
  margin-bottom: 0 !important;
  font-size: 28px !important;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  data?: QuestionTemplate;
  onClose: () => void;
  onRefresh: () => void;
}

const PostForm: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    getValues,
  } = useForm<QuestionTemplateCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [changed, setChanged] = useState<boolean>(false);
  // const [questionTemplateForm, setQuestionTemplateForm] = useState<QuestionTemplateCM | undefined>();

  const error = !!errors.title;

  const handleSubmit = async () => {
    if (!error) {
      const payload = getValues();
      await fetch(
        data?.id
          ? questionTemplateService.updateQuestionTemplate({ ...payload, id: data?.id ?? '' })
          : questionTemplateService.createQuestionTemplate(payload),
      );
    }
  };

  const handleChange = (key: string, value: any, isTrigger = false): void => {
    if (isTrigger) {
      trigger();
    }

    setChanged(true);
    setValue(key, value);
  };

  const actions = useMemo(
    () => ([
      {
        title: 'Lưu biểu mẫu',
        icon: <FiSave />,
        color: 'blue',
        onClick: () => {
          trigger();
          handleSubmit();
        },
      },
      {
        title: 'Đóng biểu mẫu',
        icon: <FiX />,
        color: 'grey',
        onClick: () => {
          if (changed) {
            confirm('Bạn đã lưu biểu mẫu?', () => {
              onClose();
            });
          } else {
            onClose();
          }
        },
      },
      // eslint-disable-next-line
    ]), [changed]);

  useEffect(() => {
    register('title', { required: 'Bắt buộc phải nhập tên biểu mẫu' });
    register('description');
    register('questionTemplateTypeId');
    register('questions');
    register('surveyResults');
  }, [register]);

  return (
    <>
      <ToolbarWrapper>
        <StyledHeader>
          {data ? 'Sửa ' : 'Tạo '}
          biểu mẫu
        </StyledHeader>
        <ActionsWrapper>
          {actions.map((o) => (
            <Action
              title={o.title}
              icon={o.icon}
              color={o.color}
              onClick={o.onClick}
            />
          ))}
        </ActionsWrapper>
      </ToolbarWrapper>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            width="4"
            control={QuestionTemplateTypeSection}
            data={watch('questionTemplateTypeId') || []}
            onChange={(value: string[]): void => {
              handleChange('questionTemplateTypeId', value || []);
            }}
          />
          <Form.Field
            width="12"
            control={Input}
            placeholder="Tên biểu mẫu"
            error={errors?.title?.message ?? false}
            value={watch('title') || ''}
            onChange={(__: any, { value }: any) => {
              handleChange('title', value, true);
            }}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default PostForm;
