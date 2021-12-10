import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import AnswerModal from '@form-assessment/question/components/AnswerModal';

import { useDispatch, useSelector, useConfirm, useFetchApi } from '@app/hooks';
import { Answer, SingleAnwserCM } from '@form-assessment/question/question.model';
import questionService from '@form-assessment/question/question.service';
import { getAnswerOfQuestion } from '@form-assessment/question/question.slice';

interface Props {
  isCreate?: boolean;
  onChange?: (d: SingleAnwserCM[]) => void;
}

const AnswerTable: React.FC<Props> = ({ isCreate, onChange }) => {
  const [answerList, setAnswerList] = useState<Answer[]>([]);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [updateDetails, setUpdateDetails] = useState<Answer>();

  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();
  const {
    selectedQuestion,
    anwserOfQuestionList,
    getAnswerOfQuestionLoading,
  } = useSelector((state) => state.formAssessment.question);

  const handleChange = async (d: SingleAnwserCM) => {
    if (isCreate) {
      setAnswerList((state) => 
        updateDetails?.id
        ? state.reduce((r, a): Answer[] => {
          if (updateDetails.id === a.id) {
            return [...r, { ...a, ...d }]
          }
          return [...r, a];
        }, [] as Answer[])
        : [...state, {
            ...d,
            id: uuidv4(),
          }],
      )
    } else {
       await fetch(
        updateDetails?.id
          ? questionService.updateAnswer({
            ...d,
            id: updateDetails?.id ?? '',
            score: parseFloat(d.score as unknown as string),
          })
          : questionService.createAnswer({
            questionId: selectedQuestion?.id ?? '',
            answers: [{
              ...d,
              score: parseFloat(d.score as unknown as string),
            }],
          }),
      );   
    }
  }

  const getData = useCallback(() => {
    if (!isCreate && selectedQuestion?.id) {
      dispatch(getAnswerOfQuestion(selectedQuestion.id));
    }
  }, [dispatch, isCreate, selectedQuestion]);
  useEffect(getData, [getData]);

  useEffect(() => {
    onChange?.(answerList.map((ans) => ({
      ..._.omit(ans, ['id']),
      score: parseFloat((ans.score as unknown) as string),
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerList]);

  return (
    <div>
      <DataList
        search
        toggle
        title="Danh sách đáp án của câu hỏi"
        data={isCreate ? answerList : (anwserOfQuestionList || [])}
        loading={fetching || getAnswerOfQuestionLoading}
        listActions={[
          {
            title: 'Tạo đáp án mới',
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
                if (isCreate) {
                  setAnswerList((state) => state.filter((s) => s.id !== d.id));
                } else {
                  await fetch(questionService.deleteAnswer(d));
                  getData();
                }
              });
            },
          }
        ]}
        itemHeaderRender={(d): string => `${d.description}`}
        itemContentRender={(d): string => `Điểm: ${d.score}`}
        getRowKey={(d): string => d.id}
      />

      <AnswerModal
        open={openCreate}
        data={updateDetails}
        onChange={handleChange}
        onClose={(): void => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
        onRefresh={getData}
      />
    </div>
  );
};

export default AnswerTable;
