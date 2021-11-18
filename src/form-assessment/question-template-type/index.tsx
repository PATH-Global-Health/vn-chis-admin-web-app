import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import QuestionTemplateTypeModal from '@form-assessment/question-template-type/components/QuestionTemplateTypeModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { QuestionTemplateType } from './question-template-type.model';
import { getQuestionTemplateType } from './question-template-type.slice';
import QuestionTemplateTypeService from './question-template-type.service';

const QuestionTemplateTypesPage: React.FC = () => {
  const { questionTemplateTypeList, getQuestionTemplateTypeLoading } = useSelector(
    (state) => state.formAssessment.questionTemplateType,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<QuestionTemplateType>();

  const getData = useCallback(() => {
    dispatch(getQuestionTemplateType());
  }, [dispatch]);

  useRefreshCallback(GroupKey.ADMIN_NEW_MANAGEMENT, ComponentKey.QUESTION_TEMPLATE_TYPE, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        toggle
        title="Danh sách loại biểu mẫu"
        data={questionTemplateTypeList}
        loading={fetching || getQuestionTemplateTypeLoading}
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
                await fetch(QuestionTemplateTypeService.deleteQuestionTemplateType(d));
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

      <QuestionTemplateTypeModal
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

export default QuestionTemplateTypesPage;
