import React, { useState, useEffect, useCallback } from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

import { FiPlus } from 'react-icons/fi';
import { Popup, Label, Icon } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import CreateModal from '@admin/user-management/permission/components/CreateModal';

import {
  useDispatch,
  useSelector,
  useFetchApi,
  useRefreshCallback,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { getPermissionsUI, getPermissionsResource } from '@admin/user-management/permission/permission.slice';
import { permissionTypeColorList } from '@admin/user-management/utils/helpers';
import { PermissionType } from '@admin/user-management/utils/constants';

interface Props {
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}

const PermissionTable: React.FC<Props> = ({ isPermissionUI, isPermissionResource }) => {
  const [openCreate, setOpenCreate] = useState(false);

  const dispatch = useDispatch();
  // const confirm = useConfirm();
  const { fetching } = useFetchApi();
  const {
    permissionUIList,
    permissionResourceList,
    getPermissionsUILoading,
    getPermissionsResourceLoading,
  } = useSelector(
    (state) => state.admin.userManagement.permission,
  );

  const title =
    isPermissionUI
    ? 'Danh sách quyền UI'
    : isPermissionResource
      ? 'Danh sách quyền Resource'
      : 'Danh sách quyền UI' 

  const data = 
    isPermissionUI
    ? permissionUIList
    : isPermissionResource
      ? permissionResourceList
      : permissionUIList

  const loading = fetching || getPermissionsUILoading || getPermissionsResourceLoading;

  const getData = useCallback(() => {
    dispatch(
      isPermissionUI
      ? getPermissionsUI()
      : isPermissionResource
        ? getPermissionsResource()
        : getPermissionsUI()
    );
  }, [isPermissionUI, isPermissionResource, dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.ADMIN_USER_MANAGEMENT,
    ComponentKey.ADMIN_PERMISSION,
    getData,
  );

  return (
    <>
      <DataList
        toggle
        search
        title={title}
        data={data}
        loading={loading}
        totalCount={data.length}
        listActions={[
          {
            title: 'Tạo',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              setOpenCreate(true);
            },
          },
        ]}
        itemActions={[]}
        getRowKey={(d): string => d.id}
        itemHeaderRender={(d): JSX.Element => {
          if (isPermissionResource) {
            const permissionTypeColor = permissionTypeColorList.find((p) => d?.normalizedMethod && p.name.includes(d?.normalizedMethod ?? ''))
            return (
              <>
                {d?.normalizedMethod ? (
                  <Popup
                    size="mini"
                    inverted
                    position="top left"
                    content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'Từ chối' : 'Cho phép'}
                    trigger={
                      <Label color={(permissionTypeColor?.color ?? 'black') as SemanticCOLORS} basic horizontal>
                        <Icon name={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'x' : 'check'} /> 
                        {d?.normalizedMethod ?? ''}
                      </Label>
                    }
                  />
                ) : null}
     
                {d?.url ?? ''}
              </>
            )
          }
          return (
            <>
              <Popup
                size="mini"
                inverted
                position="top left"
                content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'Từ chối' : 'Cho phép'}
                trigger={
                  <Label color={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'red' : 'green'} basic horizontal>
                    Tất cả
                  </Label>
                }
              />
              {d?.name ?? ''}
            </>
          );
        }}
        itemContentRender={(d): string => isPermissionUI ? `Mã ${d?.code ?? ''}` : ''}
      />

      <CreateModal
        open={openCreate}
        isPermissionUI={isPermissionUI}
        isPermissionResource={isPermissionResource}
        onClose={() => setOpenCreate(false)}
        onRefresh={getData}
      />
    </>
  );
};

export default PermissionTable;
