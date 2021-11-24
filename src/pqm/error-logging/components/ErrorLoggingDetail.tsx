import React, { useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { FiChevronRight } from 'react-icons/fi';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import InfoRow from '@pqm/error-logging/components/InfoRow';
import DetailSegment from '@pqm/error-logging/components/DetailSegment';
import DetailErrorTable from '@pqm/error-logging/components//DetailErrorTable';

import { useSelector, useDispatch } from '@app/hooks';
import { closeComponentTab } from '@app/slices/global';
import { selectErrorLogging } from '@pqm/error-logging/slices';
import { GroupKey } from '@app/utils/component-tree';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const InformationWrapper = styled.div`
  margin-bottom: 8px;
`;
const DetailWrapper = styled.div``;

const ErrorLoggingDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedErrorLogging } = useSelector(
    (state) => state.pqm.errorLogging,
  );

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const breadCrumb: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: 'Danh sách lỗi',
        active: !!selectedErrorLogging?.id,
        onClick: (): void => {
          dispatch(selectErrorLogging(undefined));
          dispatch(
            closeComponentTab({
              groupKey: GroupKey.ADMIN_PQM_ERROR_LOGGING_DETAIL,
              key: GroupKey.ADMIN_PQM_ERROR_LOGGING_DETAIL,
            }),
          );
        },
      },
    ];

    if (selectedErrorLogging?.id) {
      breadCrumb.push({
        key: 1,
        content: 'Chi tiết lỗi',
        active: true,
      });
    }

    return breadCrumb;
  }, [selectedErrorLogging, dispatch]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      <InformationWrapper>
        <InfoRow
          label="Thời gian"
          content={
            selectedErrorLogging?.dateTime
              ? moment(selectedErrorLogging.dateTime).format(
                  'HH:mm | DD/MM/YYYY',
                )
              : ''
          }
        />
      </InformationWrapper>
      <DetailWrapper>
        {!!selectedErrorLogging?.rawData && (
          <DetailSegment
            title="Request body"
            content={
              selectedErrorLogging?.rawData ? selectedErrorLogging.rawData : {}
            }
          />
        )}
        {!!selectedErrorLogging?.result?.data && <DetailErrorTable />}
      </DetailWrapper>
    </>
  );
};

export default ErrorLoggingDetail;
