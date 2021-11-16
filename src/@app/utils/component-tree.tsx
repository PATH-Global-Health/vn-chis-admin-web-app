import React, { ReactNode } from 'react';

import UserPage from '@admin/user-management/user';
import GroupPage from '@admin/user-management/group';
import RolePage from '@admin/user-management/role';

import CategoriesPage from '@news/category';
import TagsPage from '@news/tag';
import PostsPage from '@news/post';
import ServicesPage from '@category/service';
import QuestionTemplateTypesPage from '@form-assessment/question-template-type';
import QuestionPage from '@form-assessment/question';

export enum GroupKey {
  // #region admin
  ADMIN_USER_MANAGEMENT = 'ADMIN_USER_MANAGEMENT',
  // #endregion

  // #region news
  PQM_NEWS = 'PQM_NEWS',
  // #endregion

  // #region csyt
  CSYT_CATALOG = 'CSYT_CATALOG',
  // #endregion

  // #region form assessment
  PQM_FORM_ASSESSMENT = 'PQM_FORM_ASSESSMENT',
  // #endregion
}

export enum ComponentKey {
  // #region admin
  ADMIN_USER = 'ADMIN_USER',
  ADMIN_GROUP = 'ADMIN_GROUP',
  ADMIN_ROLE = 'ADMIN_ROLE',
  // #endregion

  // #region news
  PQM_CATEGORY = 'PQM_CATEGORY',
  PQM_TAG = 'PQM_TAG',
  PQM_POST = 'PQM_POST',
  // #endregion

  // #region csyt
  CSYT_SERVICE = 'CSYT_SERVICE',
  CSYT_SERVICE_TYPE = 'CSYT_SERVICE_TYPE',

  // #region form assessment
  PQM_QUESTION = 'PQM_QUESTION',
  PQM_QUESTION_TEMPLATE_TYPE = 'PQM_QUESTION_TEMPLATE_TYPE',

  // #endregion

}

export interface Component {
  key: GroupKey | ComponentKey;
  title: string;
  hidden?: boolean;
  component?: ReactNode;
  childrenList?: Component[];
  permissionCode?: string;
}

const componentTree: Component[] = [
  {
    key: GroupKey.ADMIN_USER_MANAGEMENT,
    title: 'Quản lý người dùng',
    childrenList: [
      {
        key: ComponentKey.ADMIN_USER,
        title: 'Người dùng',
        component: <UserPage />,
      },
      {
        key: ComponentKey.ADMIN_GROUP,
        title: 'Nhóm',
        component: <GroupPage />,
      },
      {
        key: ComponentKey.ADMIN_ROLE,
        title: 'Vai trò',
        component: <RolePage />,
      },
    ],
  },
  {
    key: GroupKey.CSYT_CATALOG,
    title: 'Quản lý dịch vụ',
    //permissionCode: 'ADMIN_SERVICE_MANAGEMENT',
    childrenList: [

      {
        key: ComponentKey.CSYT_SERVICE,
        title: 'Dịch vụ',
        component: <ServicesPage />,
        /* permissionCode: 'CSYT_CATALOG_SERVICE', */
      },
    ],
  },
  {
    key: GroupKey.PQM_NEWS,
    title: 'Quản lí bài viết',
    /* permissionCode: 'PQM_NEWS', */
    childrenList: [
      {
        key: ComponentKey.PQM_CATEGORY,
        title: 'Thể loại',
        component: <CategoriesPage />,
      },
      {
        key: ComponentKey.PQM_TAG,
        title: 'Nhãn',
        component: <TagsPage />,
      },
      {
        key: ComponentKey.PQM_POST,
        title: 'Bài viết',
        component: <PostsPage />,
      },
    ],
  },
  {
    key: GroupKey.PQM_FORM_ASSESSMENT,
    title: 'Quản lí biểu mẫu đánh giá',
    /* permissionCode: 'PQM_NEWS', */
    childrenList: [
      {
        key: ComponentKey.PQM_QUESTION,
        title: 'Câu hỏi',
        component: <QuestionPage />,
      },
      {
        key: ComponentKey.PQM_QUESTION_TEMPLATE_TYPE,
        title: 'Loại biểu mẫu',
        component: <QuestionTemplateTypesPage />,
      },
    ],
  },
];

const getGroup = (groupKey: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  return group ?? null;
};

const getComponent = (groupKey: string, key: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  if (group) {
    if (!group.childrenList) {
      return group;
    }
    const childComponent = group.childrenList.find((c) => c.key === key);
    return childComponent ?? null;
  }
  return null;
};

export default componentTree;
export { getGroup, getComponent };
