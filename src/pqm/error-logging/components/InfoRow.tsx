import React from 'react';
import styled from 'styled-components';

import { Popup } from 'semantic-ui-react';

const ContentWrapper = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
`;

const Label = styled.p`
  font-size: 16px;
  margin-bottom: 6px;
  margin-right: 6px;
  float: left;
`;
const Content = styled.p`
  & span {
    font-size: 16px;
    font-weight: bold;
  }
  margin-top: 0;
  margin-bottom: 0 !important;
`;

interface Props {
  label: string;
  content: string;
}

const InfoRow: React.FC<Props> = (props) => {
  const { label, content } = props;
  return (
    <div style={{ overflow: 'hidden' }}>
      <Label>{`${label}:`}</Label>
      <Content>
        <Popup
          inverted
          position="top left"
          content={content || '...'}
          trigger={<ContentWrapper>{content || '...'}</ContentWrapper>}
        />
      </Content>
    </div>
  );
};

export default React.memo(InfoRow);
