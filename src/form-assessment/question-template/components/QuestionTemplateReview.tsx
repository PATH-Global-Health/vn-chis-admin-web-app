import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader, Header, Segment } from 'semantic-ui-react';

import { useDispatch, useSelector } from '@app/hooks';
import { Question } from '@form-assessment/question/question.model';
import { getQuestionTemplateDetail } from '../question-template.slice';

const Wrapper = styled.div`
  & .header {
    margin-top: 0 !important;
    margin-bottom: 8px !important;
    margin-right: auto !important;
  }
  & .body {
    margin: 0 !important;
    padding: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: none;
    position: relative;
    & div {
      padding-top: 5px !important;
      padding-bottom: 5px !important;
    }
    &__question {
      padding-bottom: 5px !important;
      &-header {
        font-weight: 700;
        margin-right: 5px;
      }
    }
    &__answer {
      margin-left: 10px;
      padding-bottom: 3px !important;
    }
  }
`;

const QuestionTemplatePreview = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const dispatch = useDispatch();
  const {
    selectingQuestionTemplate,
    questionTemplateDetail,
    getQuestionTemplateDetailLoading
  } = useSelector((state) => state.formAssessment.questionTemplate);

  const filteredData: Question[] = useMemo(() =>
    (questionTemplateDetail?.questions ?? [])
      .slice()
      .sort((a, b) => (a?.order ?? 0) > (b?.order ?? 0) ? 1 : 0)
      .slice(pageIndex, 10)
  , [questionTemplateDetail, pageIndex]);

  const getData = useCallback(() => {
    if (selectingQuestionTemplate?.id) {
      dispatch(getQuestionTemplateDetail(selectingQuestionTemplate.id));
    }
  }, [selectingQuestionTemplate, dispatch]);
  useEffect(getData, [getData]);

  useEffect(() => {
    if (pageIndex !== 0) {
      setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionTemplateDetail]);

  return (
    <Wrapper>
      <Header>Xem biểu mẫu</Header>
      <Segment className="body">
        <Dimmer inverted active={getQuestionTemplateDetailLoading}>
          <Loader />
        </Dimmer>
        {filteredData.map((question, index) => (
          <div key={`question_${index}`}>
            <div className="body__question">
              <span className="body__question-header">
                Câu {index + 1}: 
              </span>
              {question.description}
            </div>
            {question.answers.map((answer, jndex) => (
              <div key={`answer_${jndex}`} className="body__answer"> - {answer.description} ({answer.score} điểm)</div>
            ))}
          </div>
        ))}
      </Segment>
    </Wrapper>
  );
};

export default QuestionTemplatePreview;
