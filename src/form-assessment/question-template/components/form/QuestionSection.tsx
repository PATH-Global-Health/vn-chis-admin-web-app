import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { FiPlus } from 'react-icons/fi';
import { Segment, Menu, Header, Icon } from 'semantic-ui-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
} from 'react-beautiful-dnd';
import QuestionModal from '@form-assessment/question-template/components/form/QuestionModal';
import Action from '@news/post/components/post-form/Action';

import { useConfirm } from '@app/hooks';
import { Question as QuestionModel } from '@form-assessment/question/question.model';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Wrapper = styled.div`
  & .dropdown--custom {
    font-size: 1rem !important;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 1rem 0;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
`;

const QuestionWrapper = styled.div`
  & .segment {
    padding: 0.5em !important;
    border-top: 0 !important;
  }
  & .question {
    padding-bottom: 5px !important;
    &-header {
      font-weight: 700;
      margin-right: 5px;
    }
  }
  & .answer {
    margin-left: 10px;
    padding-bottom: 3px !important;
  }
`;

interface ExtendQuestionModel extends QuestionModel {
  isNew: boolean;
  isDeleted: boolean;
}

interface PropsQuestion {
  data: ExtendQuestionModel;
  provided: DraggableProvided;
  onDelete: (id: string) => void;
  onChange: (data: ExtendQuestionModel) => void;
}

interface PropsQuestionSection {
  data?: ExtendQuestionModel[];
  onChange: (d: ExtendQuestionModel[]) => void;
}

const Question: React.FC<PropsQuestion> = ({ data, provided, onDelete }) => {
  return (
    <div style={{ marginBottom: '1em' }}>
      <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
        <Menu icon size="small" attached="top">
          <Menu.Item {...provided.dragHandleProps}>
            <Icon name="ellipsis vertical" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Icon name="trash" onClick={() => onDelete(data.id)} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <QuestionWrapper>
          <Segment small attached="bottom">
            <div className="question">
              <span className="question-header">
                Câu hỏi: 
              </span>
              {data.description}
            </div>
            {data.answers.map((answer, index) => (
              <div key={`${data.id}_${index}`} className="answer"> - {answer.description} ({answer.score} điểm)</div>
            ))}
          </Segment>
      </QuestionWrapper>
      </Wrapper>
    </div>
  );
};

const QuestionSection: React.FC<PropsQuestionSection> = ({ data, onChange }) => {
  const [modalAddQuestion, setModalAddQuestion] = useState(false);
  const [questionList, setQuestionList] = useState<ExtendQuestionModel[]>([]);

  const confirm = useConfirm();

  const addQuestion = (q: QuestionModel | undefined) => {
    if (q) {
      setQuestionList((state) => [...state, { ...q, isNew: true, isDeleted: false }]);
    }
  }

  const onDrag = ({ destination, source }: any): void => {
    if (!destination) return;
    // eslint-disable-next-line
    const _questionList = Array.from(questionList || []);
    const [removed] = _questionList.splice(source.index, 1);
    _questionList.splice(destination.index, 0, removed);
    _questionList[destination.index] = {
      ..._questionList[destination.index],
    };
    _questionList[source.index] = {
      ..._questionList[source.index],
    };
    console.log(questionList, _questionList);
    setQuestionList(_questionList);
  };

  const handleChange = (d: ExtendQuestionModel): void => {
    const questionListChanged = (questionList || []).reduce(
      (array: ExtendQuestionModel[], object: ExtendQuestionModel) => {
        // eslint-disable-next-line
        let _object = object;
        if (d.id === object.id) {
          _object = d;
        }
        return [...array, _object];
      },
      [],
    );
    setQuestionList(questionListChanged);
  };

  const handleDelete = (id: string): void => {
    confirm('Xác nhận xoá', () => {
      setQuestionList(
        (questionList || []).map((o) => ({
          ...o,
          isDeleted: o.isDeleted ? o.isDeleted : o.id === id,
        })),
      );
    });
  };

  useEffect(() => {
    if (data && data.length > 0 && data !== questionList) {
      setQuestionList(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (questionList && questionList.length > 0 && questionList !== data) {
      onChange(questionList.map((quest, index) => ({
        ...quest,
        order: index,
      })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionList]);

  return (
    <>
      <ToolbarWrapper>
        <Header style={{ marginTop: '0.25em', marginBottom: '0.25em' }}>
          Danh sách câu hỏi
        </Header>
        <ActionsWrapper>
          <Action
            title="Thêm câu hỏi"
            icon={<FiPlus />}
            color="green"
            onClick={() => setModalAddQuestion(true)}
          />
        </ActionsWrapper>
      </ToolbarWrapper>
      <DragDropContext onDragEnd={onDrag}>
        <Droppable droppableId="parts">
          {(dropProvided) => (
            // eslint-disable-next-line
            <Container ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {(questionList || [])
                .filter((o) => !o?.isDeleted ?? false)
                .map((o, index) => (
                  <Draggable key={o.id} draggableId={o.id} index={index}>
                    {(dragProvided) => (
                      <Question
                        data={o}
                        provided={dragProvided}
                        onDelete={(id: string): void => {
                          handleDelete(id);
                        }}
                        onChange={(d: ExtendQuestionModel) => handleChange(d)}
                      />
                    )}
                  </Draggable>
                ))}
              {dropProvided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>

      <QuestionModal
        open={modalAddQuestion}
        onClose={() => setModalAddQuestion(false)}
        onChange={(data: QuestionModel | undefined) => addQuestion(data)}
      />
    </>
  );
};

export default QuestionSection;
