import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header, Segment } from 'semantic-ui-react';
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
  return (
    <Wrapper>
      <Header>Xem biểu mẫu</Header>
      <Segment className="body">
        {data && data.questions.slice(0, 10).map((question, index) => (
          <div>
            <div className="body__question">
              <span className="body__question-header">
                Câu {index + 1}: 
              </span>
              {question.description}
            </div>
            {question.answers.map((answer) => (
              <div className="body__answer"> - {answer.description} ({answer.score} điểm)</div>
            ))}
          </div>
        ))}
        {data && data.questions.length > 10 && (
          <div>...</div>
        )}
      </Segment>
    </Wrapper>
  );
};

export default QuestionTemplatePreview;
