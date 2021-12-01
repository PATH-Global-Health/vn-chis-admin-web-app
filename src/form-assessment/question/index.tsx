import React, { useState, useEffect, useCallback } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Grid } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import QuestionModal from '@form-assessment/question/components/QuestionModal';
import AnswerTable from '@form-assessment/question/components/AnswerTable';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Question } from '@form-assessment/question/question.model';
import { getQuestion, setSelectedQuestion } from '@form-assessment/question/question.slice';
import questionService from '@form-assessment/question/question.service';

const QuestionPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Question>();

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const {
    questionList,
    selectedQuestion,
    getQuestionLoading,
  } = useSelector(
    (state) => state.formAssessment.question,
  );

  const getData = useCallback(() => {
    dispatch(getQuestion());
  }, [dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.ADMIN_NEW_MANAGEMENT,
    ComponentKey.QUESTION,
    getData
  );

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={selectedQuestion?.id ? 8 : 16}>
            <DataList
              search
              toggle
              title="Danh sách câu hỏi"
              data={questionList}
              loading={fetching || getQuestionLoading}
              listActions={[
                {
                  title: 'Tạo câu hỏi mới',
                  color: 'green',
                  icon: <FiPlus />,
                  onClick: (): void => setOpenCreate(true),
                },
              ]}

              itemActions={[
                {
                  icon: <FiEdit3 />,
                  color: 'violet',
                  title: 'Sửa',
                  onClick: (d): void => setUpdateDetails(d),
                },
                {
                  icon: <FiTrash2 />,
                  color: 'red',
                  title: 'Xoá',
                  onClick: (d): void => {
                    confirm('Xác nhận xoá?', async () => {
                      if (selectedQuestion?.id && selectedQuestion.id === d.id) {
                        dispatch(setSelectedQuestion(undefined));
                      }
                      
                      await fetch(questionService.deleteQuestion(d));
                      getData();
                    });
                  },
                },
              ]}
              onRowClick={(d) => {
                if (selectedQuestion?.id && selectedQuestion?.id === d.id) {
                  dispatch(setSelectedQuestion(undefined));
                } else {
                  dispatch(setSelectedQuestion(d));
                }
              }}
              itemHeaderRender={(d): string => d.description}
              getRowKey={(d): string => d.id}
            />
          </Grid.Column>
          {selectedQuestion?.id && (
            <Grid.Column width="8">
              <AnswerTable />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>

      <QuestionModal
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
