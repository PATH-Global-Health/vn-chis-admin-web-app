import React, { useEffect, useMemo, useCallback } from 'react';

import Tab from '@app/components/Tab';
import AggregatedValueTable from '@pqm/aggregated-value/components/AggregatedValueTable';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { getIndicatorGroups } from '@pqm/category/indicator-group/indicator-group.slice';
import { AGGREGATED_VALUE_COLUMNS_BY_GROUP } from '@pqm/aggregated-value/utils/contants';

const AggregatedValuePage: React.FC = () => {
  const dispatch = useDispatch();
  const { indicatorGroupList, getIndicatorGroupsLoading } = useSelector(
    (state) => state.pqm.category.indicatorGroup,
  );

  const tabList = useMemo(
    () =>
      (indicatorGroupList || []).map((indicator) => {
        const group = AGGREGATED_VALUE_COLUMNS_BY_GROUP.find(
          (x) => x.id === indicator.id,
        );
        return {
          title: indicator.name,
          component: <AggregatedValueTable group={group} />,
        };
      }),
    [indicatorGroupList],
  );

  const getData = useCallback(() => {
    dispatch(getIndicatorGroups());
  }, [dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_AGGREGATED_VALUE,
    GroupKey.ADMIN_PQM_AGGREGATED_VALUE,
    getData,
  );

  return (
    <Tab loading={getIndicatorGroupsLoading} items={tabList} />
  );
};

export default AggregatedValuePage;
