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
import { SurveyResult, SurveyResultCM } from '@form-assessment/survey-result/survey-result.model';
import { Question as QuestionModel, QuestionForQuestionTemplateCM } from '@form-assessment/question/question.model';
import { QuestionTemplate, QuestionTemplateCM } from '@form-assessment/question-template/question-template.model';
import questionTemplateService from '@form-assessment/question-template/question-template.service';

const Wrapper = styled.div`
  position: relative;
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
  isNew: boolean;
  isDeleted: boolean;
}

interface ExtendSurveyResult extends SurveyResult {
  isNew: boolean;
  isDeleted: boolean;
}

interface ExtendQuesttionTemplateCM extends Omit<QuestionTemplateCM, 'questions' | 'surveyResults'> {
  questions: ExtendQuestionModel[];
  surveyResults: ExtendSurveyResult[];
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

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  const handleSubmit = async () => {
    if (Object.keys(errors).length === 0) {
      const payload = getValues();
      if (data?.id) {
        await fetch(questionTemplateService.updateQuestionTemplate({
          id: data.id,
          title: payload.title,
          description: payload.description,
          questions: [],
          questionTemplateTypeId: payload.questionTemplateTypeId,
        }));

        const questionDeletedList =
          payload.questions
            .filter((q) => q.isDeleted)
            .map((q): string => q.id);
        await fetch(questionTemplateService.deleteQuestion({
          id: data.id,
          questions: questionDeletedList.map((q, i) => ({
            order: i,
            questionId: q
          })),
        }));

        const questionNewestList =
          payload.questions
            .filter((q) => !q.isDeleted)
            .map((q) => q.id);
        await fetch(questionTemplateService.addQuestion({
          id: data.id,
          questions: questionNewestList.map((q, i) => ({
            order: i,
            questionId: q
          })),
        }));

        const surveyResultDeletedList =
          payload.surveyResults
            .filter((s) => !s.isNew && s.isDeleted)
            .map((s): string => s.id);
        await fetch(questionTemplateService.deleteSurveyResult({
          id: data.id,
          surveyResults: surveyResultDeletedList,
        }));

        const surveyResultNewestList =
          payload.surveyResults
            .filter((s) => s.isNew && !s.isDeleted)
            .map((s): SurveyResultCM => ({
              fromScore: parseFloat(s.fromScore.toString()),
              toScore: parseFloat(s.toScore.toString()),
              description: s.description,
            }));
        await fetch(questionTemplateService.addSurveyResult({
          id: data.id,
          surveyResults: surveyResultNewestList,
        }));
      } else {
        await fetch(questionTemplateService.createQuestionTemplate({
          ...payload,
          questions: payload.questions.map((q, i): QuestionForQuestionTemplateCM => ({
            order: i,
            questionId: q.id
          })),
          surveyResults: payload.surveyResults.map((s) => ({
            description: s.description,
            fromScore: parseFloat(s.fromScore.toString()),
            toScore: parseFloat(s.toScore.toString()),
          })),
        }))
      }

      onRefresh();
      onClose();
    }
  };

  const handleChange = (key: string, value: any, isTrigger = false): void => {
    setChanged(true);
    setValue(key, value);
    if (isTrigger) {
      trigger(key);
    }
  };

  const actions = useMemo(
    () => ([
      {
        title: 'Lưu biểu mẫu',
        icon: <FiSave />,
        color: 'blue',
        onClick: async () => {
          await trigger();
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
                  error={!!errors?.questionTemplateTypeId?.message && errors.questionTemplateTypeId.message}
                  data={watch('questionTemplateTypeId') || ''}
                  onChange={(value: string[]): void => {
                    handleChange('questionTemplateTypeId', value || '');
                  }}
                />
                <Form.Field
                  width="12"
                  control={Input}
                  placeholder="Tên biểu mẫu"
                  error={!!errors?.title?.message && errors.title.message}
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
                  onChange={(d: ExtendSurveyResult[]) => {
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
