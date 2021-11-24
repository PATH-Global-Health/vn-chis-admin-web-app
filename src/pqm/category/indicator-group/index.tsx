import React, { useState, useEffect, useCallback } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Grid } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import IndicatorTable from '@pqm/category/indicator-group/components/IndicatorTable';
import CreateModal from '@pqm/category/indicator-group/components/CreateModal';
import UpdateModal from '@pqm/category/indicator-group/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { IndicatorGroup } from './indicator-group.model';
import {
  selectIndicatorGroup,
  getIndicatorGroups,
} from './indicator-group.slice';
import indicatorGroupService from './indicator-group.service';

const IndicatorGroupsPage: React.FC = () => {
  const {
    selectedIndicatorGroup,
    indicatorGroupList,
    getIndicatorGroupsLoading,
  } = useSelector((state) => state.pqm.category.indicatorGroup);
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<IndicatorGroup>();

  const getData = useCallback(() => {
    dispatch(getIndicatorGroups());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_INDICATOR,
    getData,
  );

  useEffect(getData, [getData]);

  return (
    <>
      <Grid>
        <Grid.Column width={selectedIndicatorGroup?.id ? 8 : 16}>
          <DataList
            search
            toggle
            title="Nhóm chỉ số"
            data={indicatorGroupList}
            loading={getIndicatorGroupsLoading || fetching}
            listActions={[
              {
                title: 'Tạo',
                color: 'green',
                icon: <FiPlus />,
                onClick: (): void => {
                  setOpenCreate(true);
                  dispatch(selectIndicatorGroup());
                },
              },
            ]}
            itemActions={[
              {
                icon: <FiTrash2 />,
                color: 'red',
                title: 'Xoá',
                onClick: (d): void => {
                  confirm('Xác nhận xoá', async () => {
                    await fetch(indicatorGroupService.deleteIndicatorGroup(d));
                    dispatch(selectIndicatorGroup());
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
            onRowClick={(row: IndicatorGroup): void => {
              if (selectedIndicatorGroup?.id === row?.id) {
                dispatch(selectIndicatorGroup(undefined));
              } else {
                dispatch(selectIndicatorGroup(row));
              }
            }}
            itemHeaderRender={(d): string => d.name}
            itemContentRender={(d): string =>
              d?.createdBy ?? undefined ? `Tạo bởi ${d?.createdBy ?? ''}` : ''
            }
            getRowKey={(d): string => d.id}
          />
        </Grid.Column>
        {selectedIndicatorGroup?.id && (
          <Grid.Column width={8}>
            <IndicatorTable />
          </Grid.Column>
        )}
      </Grid>

      <CreateModal
        open={openCreate}
        onClose={(): void => setOpenCreate(false)}
        onRefresh={getData}
      />

      <UpdateModal
        data={updateDetails}
        onClose={(): void => setUpdateDetails(undefined)}
        onRefresh={getData}
      />
    </>
  );
};

export default IndicatorGroupsPage;
