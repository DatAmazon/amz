import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const Users = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/users'));
const UserInfo = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/users/user-info'));
const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
const GroupPermissionPage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/group-permission'));
const BusinessWithRadioCardsPage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),);
const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));
const ListTaxCodeOfSolutionOrganization = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/tax-report-by-month'));
import DetailReceived from '@/pages/tax-report-by-month';
import DetailSent from '@/pages/tax-report-by-month';

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
      },
      {
        path: 'user-info',
        element: <WrapperRouteComponent element={<UserInfo />} titleId="title.user.info" />,
      },
      {
        path: 'users',
        element: <WrapperRouteComponent element={<Users />} titleId="title.user" />,
      },
      {
        path: "group-permission",
        element: <WrapperRouteComponent element={<GroupPermissionPage />} titleId='title.group.permisson' />
      },
      {
        path: 'guide',
        element: <WrapperRouteComponent element={<Guide />} titleId="title.guide" />,
      },
      {
        path: 'permission/route',
        element: <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" auth />,
      },
      {
        path: 'component/form',
        element: <WrapperRouteComponent element={<FormPage />} titleId="title.account" />,
      },
      {
        path: 'component/table',
        element: <WrapperRouteComponent element={<TablePage />} titleId="title.account" />,
      },
      {
        path: 'component/search',
        element: <WrapperRouteComponent element={<SearchPage />} titleId="title.account" />,
      },
      {
        path: 'component/tabs',
        element: <WrapperRouteComponent element={<TabsPage />} titleId="title.account" />,
      },
      {
        path: 'component/aside',
        element: <WrapperRouteComponent element={<AsidePage />} titleId="title.account" />,
      },
      {
        path: 'component/radio-cards',
        element: <WrapperRouteComponent element={<RadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/basic',
        element: <WrapperRouteComponent element={<BusinessBasicPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-search',
        element: <WrapperRouteComponent element={<BusinessWithSearchPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-aside',
        element: <WrapperRouteComponent element={<BusinessWithAsidePage />} titleId="title.account" />,
      },
      {
        path: 'business/with-radio-cards',
        element: <WrapperRouteComponent element={<BusinessWithRadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-tabs',
        element: <WrapperRouteComponent element={<BusinessWithTabsPage />} titleId="title.account" />,
      },
      {
        path: 'thongDiep/message-by-date',
        element: <WrapperRouteComponent element={<ListTaxCodeOfSolutionOrganization indexs={0} mstTcgp={''} totalSentUp={null} totalReturn={null} total={0}  />} titleId="title.list-tax-code" />,
      },
      {
        path: 'thongDiep/detail-message-sent',
        element: <WrapperRouteComponent element={<DetailSent indexs={0} mstTcgp={''} MLTDiep={0} total={0}   />} titleId="title.list-tax-code" />,
      },
      {
        path: 'thongDiep/detail-message-received',
        element: <WrapperRouteComponent element={<DetailReceived indexs={0} mstTcgp={''} MLTDiep={0} total={0} />} titleId="title.list-tax-code" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
