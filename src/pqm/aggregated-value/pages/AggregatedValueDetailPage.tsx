import React from 'react';
import styled from 'styled-components';

import { FiCheck, FiX } from 'react-icons/fi';
import { Header, Label } from 'semantic-ui-react';
import { useSelector } from '@app/hooks';

const Wrapper = styled.div`
  & .header {
    margin-top: 0 !important;
    margin-bottom: 16px !important;
  }
  & .ui.label {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;
const Body = styled.div`
  margin-top: 0 !important;
  margin-bottom: 16px !important;
  overflow: hidden;
  white-space: nowrap;
`;
const StyledLabel = styled(Label)`
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  margin-bottom: 10px !important;
`;

const AggregatedValueDetailPage: React.FC = () => {
  const { aggregatedValueSelected } = useSelector(
    (state) => state.pqm.aggregatedValue,
  );
  return (
    <Wrapper>
      {aggregatedValueSelected?.isValid ? (
        <StyledLabel color="green" content={<FiCheck />} detail="Valid" />
      ) : (
        <StyledLabel color="red" content={<FiX />} detail="Invalid" />
      )}
      <Header dividing content="Thông tin về kì báo cáo" />
      <Body>
        <Label
          basic
          size="medium"
          color="black"
          content="Chu kì:"
          detail={aggregatedValueSelected?.periodType ?? ''}
        />
        <Label
          basic
          size="medium"
          color="black"
          content="Năm:"
          detail={aggregatedValueSelected?.year ?? ''}
        />
        <Label
          basic
          size="medium"
          color="black"
          content="Quí:"
          detail={aggregatedValueSelected?.quarter ?? ''}
        />
        <Label
          basic
          size="medium"
          color="black"
          content="Tháng:"
          detail={aggregatedValueSelected?.month ?? ''}
        />
        <Label
          basic
          size="medium"
          color="black"
          content="Ngày:"
          detail={aggregatedValueSelected?.day ?? ''}
        />
      </Body>
      <Header dividing content="Thông tin chỉ số" />
      <Body>
        <div>
          <Label
            basic
            size="medium"
            color="black"
            content="Tên chỉ số:"
            detail={aggregatedValueSelected?.indicator?.name ?? ''}
          />
        </div>
        <div>
          <Label
            basic
            size="medium"
            color="black"
            content="Nhóm tuổi:"
            detail={aggregatedValueSelected?.ageGroup?.name ?? ''}
          />
          <Label
            basic
            size="medium"
            color="black"
            content="Nhóm giới tính:"
            detail={aggregatedValueSelected?.gender?.name ?? ''}
          />
          <Label
            basic
            size="medium"
            color="black"
            content="Nhóm nguy cơ:"
            detail={aggregatedValueSelected?.keyPopulation?.name ?? ''}
          />
          <Label
            basic
            size="medium"
            color="black"
            content="Cơ sở:"
            detail={aggregatedValueSelected?.site?.name ?? ''}
          />
        </div>
      </Body>
      <Header dividing content="Giá trị" />
      <Label
        basic
        size="medium"
        color="black"
        detail={() => {
          let format = '';
          const dataType = aggregatedValueSelected?.dataType ?? 1;
          if (dataType === 1) {
            format = `${aggregatedValueSelected?.numerator ?? ''}`;
          } else if (dataType === 2) {
            format = `${aggregatedValueSelected?.numerator ?? ''}/${aggregatedValueSelected?.denominator ?? ''}`;
          }
          return format;
        }}
      />
    </Wrapper>
  );
};

export default AggregatedValueDetailPage;
