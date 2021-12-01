import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

import { useDispatch, useSelector } from '@app/hooks';
import { getQuestionTemplateType } from '@form-assessment/question-template-type/question-template-type.slice';

const Wrapper = styled.div`
  & i.icon {
    display: none;
  }
  & .ui.labeled.icon.button {
    width: 100%;
    padding: 0.61111111em 0.61111111em !important;
  }
  & .ui.search.dropdown div.text {
    font-weight: bold;
  }
`;

interface Props {
  data?: string;
  onChange: (value: string) => void;
}

const QuestionTemplateTypeSection: React.FC<Props> = ({ data, onChange }) => {
  const [value, setValue] = useState<string>('');

  const dispatch = useDispatch();
  const { questionTemplateTypeList, getQuestionTemplateTypeLoading } = useSelector(
    (state) => state.formAssessment.questionTemplateType,
  );

  useEffect(() => {
    if (questionTemplateTypeList.length === 0) {
      dispatch(getQuestionTemplateType());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (data !== value) {
      onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  
  useEffect(() => {
    if (data) {
      setValue(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Wrapper>
      <Dropdown
        button
        floating
        labeled
        search
        loading={getQuestionTemplateTypeLoading}
        placeholder="Loại"
        className="icon"
        value={value}
        options={(questionTemplateTypeList || []).map(
          (type) => ({
            text: type?.description ?? '',
            value: type?.id ?? '',
          }),
        )}
        onChange={(e: any, { value: v }: any) => {
          setValue(v);
        }}
      />
    </Wrapper>
  );
};

export default QuestionTemplateTypeSection;
