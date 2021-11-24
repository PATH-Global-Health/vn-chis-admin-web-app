import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Grid } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import QuestionTemplatePreview from '@form-assessment/question-template/components/QuestionTemplateReview';
import QuestionTemplateForm from '@form-assessment/question-template/components/form';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { QuestionTemplate } from '@form-assessment/question-template/question-template.model';
import { getQuestionTemplates } from '@form-assessment/question-template/question-template.slice';
import questionTemplateService from '@form-assessment/question-template/question-template.service';

const QuestionTemplatePage: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<QuestionTemplate | undefined>(undefined);
  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<QuestionTemplate>();

  const { questionTemplateData, getQuestionTemplateLoading } = useSelector(
    (state) => state.formAssessment.questionTemplate,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const { data, totalSize } = questionTemplateData;
  
  const getData = useCallback(() => {
    dispatch(getQuestionTemplates({
      pageIndex,
      pageSize,
    }));
  }, [dispatch, pageIndex, pageSize]);

  useRefreshCallback(GroupKey.ADMIN_NEW_MANAGEMENT, ComponentKey.QUESTION_TEMPLATE_TYPE, getData);
  useEffect(getData, [getData]);

  return (
    <>
      {!openCreate && !updateDetails && (
        <Grid>
          <Grid.Row>
            <Grid.Column width={selected?.id ? 8 : 16}>
              <DataList
                search
                toggle
                title="Danh sách biểu mẫu"
                data={data}
                loading={fetching || getQuestionTemplateLoading}
                totalCount={totalSize}
                onPaginationChange={(p): void => {
                  setPageIndex(p.pageIndex);
                  setPageSize(p.pageSize);
                }}
                onRowClick={(r) => {
                  if (selected?.id && selected?.id === r.id) {
                    setSelected(undefined);
                  } else {
                    setSelected(r);
                  }
                }}
                listActions={[
                  {
                    title: 'Tạo biểu mẫu mới',
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
                        await fetch(questionTemplateService.deleteQuestionTemplate(d));
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
                itemHeaderRender={(d): string => d.title}
                itemContentRender={(d): string => d.description}
                getRowKey={(d): string => d.id}
              />
            </Grid.Column>
            {selected?.id && (
              <Grid.Column width="8">
                <QuestionTemplatePreview data={selected} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      )}
      {(openCreate || updateDetails) && (
        <QuestionTemplateForm
          data={updateDetails}
          onClose={() => {
            setOpenCreate(false);
            setUpdateDetails(undefined);
            setSelected(undefined);
          }}
          onRefresh={getData}
        />
      )}
    </>
  );
};

export default QuestionTemplatePage;
