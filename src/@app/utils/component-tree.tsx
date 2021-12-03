import React, { ReactNode } from 'react';

import UserPage from '@admin/user-management/user';
import GroupPage from '@admin/user-management/group';
import RolePage from '@admin/user-management/role';
// import PermissionPage from '@admin/user-management/permission';

import CategoriesPage from '@news/category';
import TagsPage from '@news/tag';
import PostsPage from '@news/post';
import ServicesPage from '@category/service';

import QuestionTemplateTypesPage from '@form-assessment/question-template-type';
import QuestionPage from '@form-assessment/question';
import QuestionTemplatesPage from '@form-assessment/question-template';

import IndicatorsPage from '@pqm/category/indicator';
import IndicatorGroupsPage from '@pqm/category/indicator-group';
import CategoryAliasesPage from '@pqm/category/category-alias';
import GendersPage from '@pqm/category/gender';
import AgeGroupsPage from '@pqm/category/age-group';
import KeyPopulationsPage from '@pqm/category/key-population';
import ProvincesPage from '@pqm/category/province';
import DistrictsPage from '@pqm/category/district';
import SitesPage from '@pqm/category/site';
import SiteTypesPage from '@pqm/category/site-type';


import AggregatedValuePage from '@pqm/aggregated-value/pages/AggregatedValuePage';
import AggregatedValueDetailPage from '@pqm/aggregated-value/pages/AggregatedValueDetailPage';

import ErrorLoggingPage from '@pqm/error-logging/pages/ErrorLoggingPage';
import ErrorLoggingDetailPage from '@pqm/error-logging/pages/ErrorLoggingDetailPage';


export enum GroupKey {
  // #region admin
  ADMIN_USER_MANAGEMENT = 'ADMIN_USER_MANAGEMENT',
  // #endregion

  // #region news
  ADMIN_NEW_MANAGEMENT = 'ADMIN_NEW_MANAGEMENT',
  // #endregion

  // #region csyt
  ADMIN_SERVICE_MANAGEMENT = 'ADMIN_SERVICE_MANAGEMENT',
  // #endregion

  // #region form assessment
  ADMIN_QUESTION_MANAGEMENT = 'ADMIN_QUESTION_MANAGEMENT',
  // #endregion

  // #region pqm
  ADMIN_PQM_CATEGORY = 'ADMIN_PQM_CATEGORY',

  ADMIN_PQM_AGGREGATED_VALUE = 'ADMIN_PQM_AGGREGATED_VALUE',
  ADMIN_PQM_AGGREGATED_VALUE_DETAIL = 'ADMIN_PQM_AGGREGATED_VALUE_DETAIL',

  ADMIN_PQM_ERROR_LOGGING = 'ADMIN_PQM_ERROR_LOGGING',
  ADMIN_PQM_ERROR_LOGGING_DETAIL = 'ADMIN_PQM_ERROR_LOGGING_DETAIL',
  // #endregion
}

export enum ComponentKey {
  // #region admin
  ADMIN_USER = 'ADMIN_USER',
  ADMIN_GROUP = 'ADMIN_GROUP',
  ADMIN_ROLE = 'ADMIN_ROLE',
  ADMIN_PERMISSION_UI = 'ADMIN_PERMISSION_UI',
  ADMIN_PERMISSION_RESOURCE = 'ADMIN_PERMISSION_RESOURCE',
  // #endregion

  // #region news
  NEWS_CATEGORY = 'NEWS_CATEGORY',
  NEWS_TAG = 'NEWS_TAG',
  NEWS_POST = 'NEWS_POST',
  // #endregion

  // #region csyt
  CSYT_SERVICE = 'CSYT_SERVICE',
  CSYT_SERVICE_TYPE = 'CSYT_SERVICE_TYPE',

  // #region form assessment
  QUESTION = 'QUESTION',
  QUESTION_TEMPLATE = 'QUESTION_TEMPLATE',
  QUESTION_TEMPLATE_TYPE = 'QUESTION_TEMPLATE_TYPE',
  // #endregion

  // #region pqm
  PQM_INDICATOR = 'PQM_INDICATOR',
  PQM_INDICATOR_GROUP = 'PQM_INDICATOR_GROUP',
  PQM_CATEGORY_ALIAS = 'PQM_CATEGORY_ALIAS',
  PQM_GENDER = 'PQM_GENDER',
  PQM_AGE_GROUP = 'PQM_AGE_GROUP',
  PQM_KEY_POPULATION = 'PQM_KEY_POPULATION',
  PQM_PROVINCE = 'PQM_PROVINCE',
  PQM_DISTRICT = 'PQM_DISTRICT',
  PQM_SITE = 'PQM_SITE',
  PQM_SITE_TYPE = 'PQM_SITE_TYPE',
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
    permissionCode: GroupKey.ADMIN_USER_MANAGEMENT,
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
      // {
      //   key: ComponentKey.ADMIN_PERMISSION_UI,
      //   title: 'Quyền UI',
      //   component: <PermissionPage isPermissionUI />,
      // },
      // {
      //   key: ComponentKey.ADMIN_PERMISSION_RESOURCE,
      //   title: 'Quyền Resource',
      //   component: <PermissionPage isPermissionResource />,
      // },
    ],
  },
  {
    key: GroupKey.ADMIN_SERVICE_MANAGEMENT,
    title: 'Quản lý dịch vụ',
    permissionCode: GroupKey.ADMIN_SERVICE_MANAGEMENT,
    childrenList: [

      {
        key: ComponentKey.CSYT_SERVICE,
        title: 'Dịch vụ',
        component: <ServicesPage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_NEW_MANAGEMENT,
    title: 'Quản lý bài viết',
    permissionCode: GroupKey.ADMIN_NEW_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.NEWS_CATEGORY,
        title: 'Thể loại',
        component: <CategoriesPage />,
      },
      {
        key: ComponentKey.NEWS_TAG,
        title: 'Nhãn',
        component: <TagsPage />,
      },
      {
        key: ComponentKey.NEWS_POST,
        title: 'Bài viết',
        component: <PostsPage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_QUESTION_MANAGEMENT,
    title: 'Quản lý biểu mẫu đánh giá',
    permissionCode: GroupKey.ADMIN_QUESTION_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.QUESTION,
        title: 'Câu hỏi',
        component: <QuestionPage />,
      },
      {
        key: ComponentKey.QUESTION_TEMPLATE_TYPE,
        title: 'Loại biểu mẫu',
        component: <QuestionTemplateTypesPage />,
      },
      {
        key: ComponentKey.QUESTION_TEMPLATE,
        title: 'Biểu mẫu',
        component: <QuestionTemplatesPage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_PQM_CATEGORY,
    title: 'Danh mục',
    permissionCode: GroupKey.ADMIN_PQM_CATEGORY,
    childrenList: [
      {
        key: ComponentKey.PQM_PROVINCE,
        title: 'Tỉnh/Thành',
        component: <ProvincesPage />,
      },
      {
        key: ComponentKey.PQM_DISTRICT,
        title: 'Quận/Huyện',
        component: <DistrictsPage />,
      },
      {
        key: ComponentKey.PQM_SITE,
        title: 'Cơ sở',
        component: <SitesPage />,
      },
      {
        key: ComponentKey.PQM_INDICATOR,
        title: 'Chỉ số',
        component: <IndicatorsPage />,
      },
      {
        key: ComponentKey.PQM_GENDER,
        title: 'Giới tính',
        component: <GendersPage />,
      },
      {
        key: ComponentKey.PQM_SITE_TYPE,
        title: 'Loại cơ sở',
        component: <SiteTypesPage />,
      },
      {
        key: ComponentKey.PQM_AGE_GROUP,
        title: 'Nhóm tuổi',
        component: <AgeGroupsPage />,
      },
      {
        key: ComponentKey.PQM_KEY_POPULATION,
        title: 'Nhóm nguy cơ',
        component: <KeyPopulationsPage />,
      },
      {
        key: ComponentKey.PQM_INDICATOR_GROUP,
        title: 'Nhóm chỉ số',
        component: <IndicatorGroupsPage />,
      },
      {
        key: ComponentKey.PQM_CATEGORY_ALIAS,
        title: 'Viết tắt',
        component: <CategoryAliasesPage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_PQM_AGGREGATED_VALUE,
    title: 'Dữ liệu tổng hợp',
    permissionCode: GroupKey.ADMIN_PQM_AGGREGATED_VALUE,
    component: <AggregatedValuePage />,
  },
  {
    key: GroupKey.ADMIN_PQM_AGGREGATED_VALUE_DETAIL,
    title: 'Dữ liệu tổng hợp chi tiết',
    hidden: true,
    permissionCode: GroupKey.ADMIN_PQM_AGGREGATED_VALUE,
    component: <AggregatedValueDetailPage />,
  },
  {
    key: GroupKey.ADMIN_PQM_ERROR_LOGGING,
    title: 'Nhật ký lỗi',
    permissionCode: GroupKey.ADMIN_PQM_ERROR_LOGGING,
    component: <ErrorLoggingPage />,
  },
  {
    key: GroupKey.ADMIN_PQM_ERROR_LOGGING_DETAIL,
    title: 'Chi tiết nhật ký lỗi',
    hidden: true,
    permissionCode: GroupKey.ADMIN_PQM_ERROR_LOGGING,
    component: <ErrorLoggingDetailPage />,
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
