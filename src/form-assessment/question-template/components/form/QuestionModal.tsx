import React, { useState, useEffect } from 'react';

import { Modal, Form, Select, Button } from 'semantic-ui-react';

import { useSelector, useDispatch } from '@app/hooks';
import { Question } from '@form-assessment/question/question.model';
import { getQuestion } from '@form-assessment/question/question.slice';

interface Props {
  open: boolean;
  onClose: () => void;
  onChange: (data: Question | undefined) => void;
}

const QuestionModal: React.FC<Props> = ({ open, onClose, onChange }) => {
  const [value, setValue] = useState<Question | undefined>(undefined);

  const dispatch = useDispatch();
  const { questionList, getQuestionLoading } = useSelector((state) => state.formAssessment.question);

  useEffect(() => {
    if (questionList.length === 0) {
      dispatch(getQuestion());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Thêm câu hỏi
      </Modal.Header>
      <Modal.Content>
        <Form.Group widths="equal">
          <Form.Field
            fluid
            search
            loading={getQuestionLoading}
            control={Select}
            options={(questionList || []).map((q) => ({
              value: q.id,
              text:  q.description.slice(0, 90) + '...'
            }))}
            onChange={(__: any, { value: v }: any) => setValue(questionList.find((q) => q.id === v))}
          />
        </Form.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          icon="checkmark"
          labelPosition="right"
          content="Xác nhận"
          onClick={() => {
            onChange(value);
            onClose();
          }}
        />
      </Modal.Actions>
    </Modal> 
  )
};

export default QuestionModal;