import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Segment } from 'semantic-ui-react';
import RichTextEditor, { EditorValue } from 'react-rte';

const Wrapper = styled.div`
  & .segment {
    padding: 0 !important;
    border-top: 0 !important;
  }

  & .RichTextEditor__editor___1QqIU {
    font-family: 'Quicksand', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  & .ButtonGroup__root___3lEAn {
    margin: 0;
  }
  & .ButtonWrap__root___1EO_R {
    margin: 0;
    padding: 6px 8.3px;
    border-right: 1px solid #d4d4d5;
    & span {
      background: none;
    }
  }
  & .IconButton__isActive___2Ey8p {
    background: #dddddd !important;
  }
  & .style {
    &__block {
      background: none;
      border: 0;
      &--bold {
        span {
          font-family: Icons;
          &:before {
            content: "\f032";
          }
        }
      }
      &--italic {
        span {
          font-family: Icons;
          &:before {
            content: "\f033";
          }
        }
      }
      &--underline {
        span {
          font-family: Icons;
          &:before {
            content: "\f0cd";
          }
        }
      }
      &--strikethrought {
        span {
          font-family: Icons;
          &:before {
            content: "\f0cc";
          }
        }
      }
    }
  }
`;

interface Props {
  data?: string;
  isEdit: boolean;
  onChange: (data: string) => void;
}

const TextSection: React.FC<Props> = ({ data, isEdit, onChange }) => {
  const [content, setContent] = useState<EditorValue>(
    RichTextEditor.createValueFromString(data || '', 'html'),
  );

  const disabled = !isEdit;

  useEffect(() => {
    onChange(content.toString('html'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <Wrapper>
      <Segment small attached="bottom">
        <RichTextEditor
          rootStyle={{
            border: '0',
            borderRadius: '0',
          }}
          toolbarStyle={{
            padding: '0',
            margin: '0',
          }}
          toolbarConfig={{
            display: ["INLINE_STYLE_BUTTONS"],
            INLINE_STYLE_BUTTONS: [
              {
                label: 'Bold',
                style: 'BOLD',
                className: 'style__block style__block--bold',
              },
              {
                label: 'Italic',
                style: 'ITALIC',
                className: 'style__block style__block--italic',
              },
              {
                label: 'Underline',
                style: 'UNDERLINE',
                className: 'style__block style__block--underline',
              },
              {
                label: 'Strike through',
                style: 'STRIKETHROUGH',
                className: 'style__block style__block--strikethrought',
              },
            ],
            BLOCK_TYPE_DROPDOWN: [],
            BLOCK_TYPE_BUTTONS: [],
          }}
          placeholder="Nội dung..."
          disabled={disabled}
          value={content}
          onChange={(result) => setContent(result)}
        />
      </Segment>
    </Wrapper>
  );
};

export default TextSection;
