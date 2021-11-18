import React, { useState } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader} from 'semantic-ui-react';
import {
  Answer,
  Question,
} from '@form-assessment/question/question.model';
import DataList from '@app/components/data-list';
import QuestionService from '../question.service';
import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useConfirm, useFetchApi } from '@app/hooks';
import AnswerModal from './AnswerModal';

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
  data?: Question;
  edit?: boolean;
  loading?: boolean;
  onRefresh: () => void;
}

const QuestionPreview: React.FC<Props> = ({ title, data, edit = false, loading = false, onRefresh }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Answer>();

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      <DataList
        search
        toggle
        title={title}
        data={data?.answers ?? []}
        loading={loading || fetching}
        listActions={[
          {
            title: 'Tạo loại biểu mẫu mới',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        itemActions={[
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              confirm('Xác nhận xoá?', async () => {
                await fetch(QuestionService.deleteAnswer(d));
                toast.success('Xóa thành công');
                onRefresh();
              });
            },
          },
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Sửa',
            onClick: (d): void => setUpdateDetails(d),
          },
        ]}
        itemHeaderRender={(d): string => `(${d.score} Điểm) - ${d.description}`}
        getRowKey={(d): string => d.id}
      />
      <AnswerModal
        open={openCreate}
        data={updateDetails}
        onClose={(): void => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
        onRefresh={onRefresh}
      />
    </Wrapper>

  );
};

export default QuestionPreview;
