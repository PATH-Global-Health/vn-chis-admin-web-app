import React, { useState } from 'react';

import { FiPlus, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import AddIndicatorToGroup from '@pqm/category/indicator-group/components/AddIndicatorToGroup';

import { useFetchApi, useConfirm, useSelector, useDispatch } from '@app/hooks';
import { IndicatorGroup } from '@pqm/category/indicator-group/indicator-group.model';
import { selectIndicatorGroup } from '@pqm/category/indicator-group/indicator-group.slice';
import indicatorGroupService from '@pqm/category/indicator-group/indicator-group.service';

const IndicatorTable: React.FC = () => {
  const { selectedIndicatorGroup } = useSelector(
    (state) => state.pqm.category.indicatorGroup,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openAdd, setOpenAdd] = useState(false);

  return (
    <>
      {selectedIndicatorGroup?.id && (
        <DataList
          search
          toggle
          title={`Những chỉ số của nhóm ${selectedIndicatorGroup.name}`}
          data={selectedIndicatorGroup.indicators || []}
          loading={fetching}
          listActions={[
            {
              title: 'Thêm',
              color: 'green',
              icon: <FiPlus />,
              onClick: () => setOpenAdd(true),
            },
          ]}
          itemActions={[
            {
              icon: <FiTrash2 />,
              color: 'red',
              title: 'Xoá',
              onClick: (d): void => {
                confirm('Xác nhận xoá', async () => {
                  const data = {
                    ...selectedIndicatorGroup,
                    indicators: (
                      selectedIndicatorGroup.indicators || []
                    ).filter((indicator) => d.id !== indicator.id),
                  };
                  await fetch(indicatorGroupService.updateIndicatorGroup(data));
                  dispatch(selectIndicatorGroup(data));
                });
              },
            },
          ]}
          itemHeaderRender={(d): string => d.name}
          itemContentRender={(d): string => d.description}
          getRowKey={(d): string => d.id}
        />
      )}

      <AddIndicatorToGroup
        open={openAdd}
        onClose={(): void => setOpenAdd(false)}
        onRefresh={(d: IndicatorGroup) => {
          dispatch(selectIndicatorGroup(d));
        }}
      />
    </>
  );
};

export default IndicatorTable;
