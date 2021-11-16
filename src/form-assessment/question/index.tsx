import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import CreateModal from '@form-assessment/question/components/CreateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Question } from './question.model';
import { getQuestion } from './question.slice';
import QuestionService from './question.service'


const QuestionPage: React.FC = () => {
  const { questionList, getQuestionLoading } = useSelector(
    (state) => state.formAssessment.question,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Question>();

  const getData = useCallback(() => {
    dispatch(getQuestion());
  }, [dispatch]);

  useRefreshCallback(GroupKey.PQM_NEWS, ComponentKey.PQM_QUESTION_TEMPLATE_TYPE, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        toggle
        title="Danh sách loại biểu mẫu"
        data={questionList}
        loading={fetching || getQuestionLoading}
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
                await fetch(QuestionService.deleteQuestion(d));
                getData();
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
        itemHeaderRender={(d): string => d.description}
        getRowKey={(d): string => d.id}
      />

      <CreateModal
        open={openCreate}
        data={updateDetails}
        onClose={(): void => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
        onRefresh={getData}
      />
    </>
  );
};

export default QuestionPage;
