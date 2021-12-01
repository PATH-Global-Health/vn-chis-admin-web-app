import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Header, Segment } from 'semantic-ui-react';
import { Question } from '@form-assessment/question/question.model';
import { QuestionTemplate } from '@form-assessment/question-template/question-template.model';

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

interface Props {
  data?: QuestionTemplate;
}

const QuestionTemplatePreview: React.FC<Props> = ({ data }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const filteredData: Question[] = useMemo(() =>
    (data?.questions ?? [])
      .slice()
      .sort((a, b) => (a?.order ?? 0) > (b?.order ?? 0) ? 1 : 0)
      .slice(pageIndex, 10)
  , [data, pageIndex]);

  useEffect(() => {
    if (pageIndex !== 0) {
      setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Wrapper>
      <Header>Xem biểu mẫu</Header>
      <Segment className="body">
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
