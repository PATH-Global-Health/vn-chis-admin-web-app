import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Dimmer, Loader, Form, Header, Input, Grid, TextArea } from 'semantic-ui-react';
import { FiSave, FiX } from 'react-icons/fi';
import QuestionTemplateTypeSection from '@form-assessment/question-template/components/form/QuestionTemplateTypeSection';
import SurveyResultSection from '@form-assessment/question-template/components/form/SurveyResultSection';
import QuestionSection from '@form-assessment/question-template/components/form/QuestionSection';
import Action from '@news/post/components/post-form/Action';

import { useFetchApi, useConfirm } from '@app/hooks';
import { SurveyResult } from '@form-assessment/survey-result/survey-result.model';
import { Question as QuestionModel } from '@form-assessment/question/question.model';
import { QuestionTemplate, QuestionTemplateCM } from '@form-assessment/question-template/question-template.model';
import questionTemplateService from '@form-assessment/question-template/question-template.service';

const Wrapper = styled.div`
  positive: relative;
`;
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

interface ExtendQuestionModel extends QuestionModel {
  isDeleted: boolean;
}

interface ExtendQuesttionTemplateCM extends Omit<QuestionTemplateCM, 'questions'> {
  questions: ExtendQuestionModel[];
}

interface Props {
  data?: QuestionTemplate;
  onClose: () => void;
  onRefresh: () => void;
}

const PostForm: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  const [changed, setChanged] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    getValues,
  } = useForm<ExtendQuesttionTemplateCM>({
    defaultValues: {},
  });

  const error = !!errors.title;
  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  const handleSubmit = async () => {
    if (!error) {
      const payload = getValues();
      if (data?.id) {

      } else {
        await fetch(questionTemplateService.createQuestionTemplate({
          ...payload,
          questions: payload.questions.map((q) => q.id),
          surveyResults: payload.surveyResults.map((s) => ({
            description: s.description,
            fromScore: parseFloat(s.fromScore.toString()),
            toScore: parseFloat(s.toScore.toString()),
          })),
        }))
      }

      onRefresh();
      onClose();
      // const payload = getValues();
      // await fetch(
      //   data?.id
      //     ? questionTemplateService.updateQuestionTemplate({ ...payload, id: data?.id ?? '' })
      //     : questionTemplateService.createQuestionTemplate(payload),
      // );
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
    register('questionTemplateTypeId', { required: 'Bắt buộc phải chọn loại biểu mẫu' });
    register('questions', { required: 'Bắt buộc phải thêm câu hỏi' });
    register('surveyResults', { required: 'Bắt buộc phải thêm kết quả' });
  }, [register]);
  useEffect(() => {
    if (data?.id) {
      reset({
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          isDeleted: false,
          isNew: false,
        })),
        surveyResults: data.surveyResults.map((s) => ({
          ...s,
          id: s?.id ?? uuidv4(),
        })),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Dimmer inverted active={fetching}>
        <Loader />
      </Dimmer>
      <ToolbarWrapper>
        <StyledHeader>
          {data ? 'Sửa ' : 'Tạo '}
          biểu mẫu
        </StyledHeader>
        <ActionsWrapper>
          {actions.map((o, i) => (
            <Action
              key={`action_${i}`}
              title={o.title}
              icon={o.icon}
              color={o.color}
              onClick={o.onClick}
            />
          ))}
        </ActionsWrapper>
      </ToolbarWrapper>
      <Form>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
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
              <Form.Group widths="equal">
                <Form.Field
                  label="Mô tả"
                  control={TextArea}
                  value={watch('description') || ''}
                  onChange={(__: any, { value }: any) => {
                    setValue('description', value);
                  }}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  data={watch('surveyResults') || []}
                  control={SurveyResultSection}
                  onChange={(d: SurveyResult[]) => {
                    setValue('surveyResults', d);
                  }}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={8}>
              <Form.Group widths="equal">
                <Form.Field
                  data={watch('questions') || []}
                  control={QuestionSection}
                  onChange={(d: ExtendQuestionModel[]) => {
                    setValue('questions', d);
                  }}
                />
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Wrapper>
  );
};

export default PostForm;
