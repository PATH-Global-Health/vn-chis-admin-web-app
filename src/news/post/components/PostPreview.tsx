import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Dimmer, Loader, Header, Segment } from 'semantic-ui-react';
import {
  PostCM,
  PostUM,
  PostPreview as PostPreviewModal,
} from '@news/post/post.model';

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
    &__header {
      & img {
        width: 100%;
        min-height: 300px;
      }
      & h3 {
        margin-top: 0;
        margin-bottom: 6px !important;
        font-size: 1.6rem;
      }
      & h4 {
        margin: 0;
        font-weight: 600;
        font-size: 18px;
        color: #a1a1a3;
      }
      & span {
        font-size: 15px;
        color: #a1a1a3;
      }
    }

    & .image {
      & img {
        max-width: 450px;
      }
    }
  }
`;

interface Props {
  title?: string;
  data?: PostPreviewModal | PostCM | PostUM;
  edit?: boolean;
  loading?: boolean;
}

const PostPreview: React.FC<Props> = ({ title, data, edit = false, loading = false }) => {
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (data?.description) {
      const parse = /data:(.*)/i.exec(data.description);
      setDescription(parse ? parse[0] : '');
    }
  }, [data]);

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      {title && <Header>{title}</Header>}
      <Segment className="body">
        <div className="body__header">
          {description !== '' && <img src={description} alt="" />}
          {data?.name && <h3>{data.name.length > 48 ? `${data.name.substring(0, 48)}...` : data.name}</h3>}
          {data?.writter && <h4>{`Người đăng ${data.writter}`}</h4>}
          {data?.publishDate && <span>{`Vào lúc ${moment(data.publishDate).format('HH:mm DD/MM/YYYY')}`}</span>}
        </div>
        {!loading &&
          (data?.parts ?? [])
            .filter((o) => !o?.isDeleted)
            .sort((a, b) => (a.order > b.order && !edit ? 1 : 0))
            .map((o) => {
              let node = o.content;
              let className = 'content';
              if (o.type === 1 && o.content !== '') {
                className = 'image';
                node = `<img src=${node} alt="" />`;
              }
              return (
                <div
                  className={className}
                  // eslint-disable-next-line
                  dangerouslySetInnerHTML={{ __html: node }}
                />
              );
            })}
      </Segment>
    </Wrapper>
  );
};

export default PostPreview;
