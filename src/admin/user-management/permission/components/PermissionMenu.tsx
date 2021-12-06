import React from 'react';
import { Tab } from 'semantic-ui-react';
import PermissionTable from '@admin/user-management/permission/components/PermissionTable';

const panes = [
  {
    menuItem: 'UI',
    render: () => <PermissionTable isPermissionUI />,
  },
  {
    menuItem: 'Resource',
    render: () => 
        <PermissionTable isPermissionResource />,
  },
];

const PermissionMenu: React.FC = () => {
  return (
    <Tab size="tiny" menu={{ pointing: true }} panes={panes} />
  );
};

export default PermissionMenu;