import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import QuestionModal from '@form-assessment/question/components/QuestionModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Question } from './question.model';
import { getQuestion, setSelectedQuestion } from './question.slice';
import QuestionService from './question.service'
import { toast } from 'react-toastify';
import { Grid } from 'semantic-ui-react';
import QuestionPreview from './components/QuestionReview';


const QuestionPage: React.FC = () => {
  const {
    questionList,
    selectedQuestion,
    getQuestionLoading,
    getSelectedQuestionLoading
  } = useSelector(
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

  useEffect(() => {
    if (selectedQuestion?.id) {
      dispatch(setSelectedQuestion(questionList.find((q) => q.id === selectedQuestion.id)))
    }
  }, [questionList]);

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
                  icon: <FiTrash2 />,
                  color: 'red',
                  title: 'Xoá',
                  onClick: (d): void => {
                    confirm('Xác nhận xoá?', async () => {
                      await fetch(QuestionService.deleteQuestion(d));
                      toast.success('Xóa thành công');
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
              <QuestionPreview
                title="Các lựa chọn của câu hỏi"
                loading={getSelectedQuestionLoading}
                data={selectedQuestion}
                onRefresh={getData}
              />
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
