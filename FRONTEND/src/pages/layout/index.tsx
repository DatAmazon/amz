import type { MenuChild, MenuList } from '@/interface/layout/menu.interface';
import type { FC } from 'react';

import './index.less';

import { Drawer, Layout, theme as antTheme } from 'antd';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';

import { getMenuByUser } from '@/api/system/menu-api';
import { setUserItem } from '@/stores/users/user.store';
import { getFirstPathCode } from '@/utils/get-first-path';
import { getGlobalState } from '@/utils/get-global-state';

import { useGuide } from '../guide/useGuide';
import HeaderComponent from './header';
import MenuComponent from './menu';
import TagsView from './tagView';
import { getGroupPermissionByUser } from '@/api/system/group-api';

const { Sider, Content } = Layout;
const WIDTH = 992;

const LayoutPage: FC = () => {
  const location = useLocation();
  const [openKey, setOpenkey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed, newUser } = useSelector(state => state.user);
  const token = antTheme.useToken();

  const isMobile = device === 'MOBILE';
  const dispatch = useDispatch();
  const { driverStart } = useGuide();

  useEffect(() => {
    const code = getFirstPathCode(location.pathname);

    setOpenkey(code);
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed,
      }),
    );
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];

    menu.forEach(m => {
      if (!m?.data?.length) MenuListAll.push(m);
      else m?.data.forEach(mu => { MenuListAll.push(mu); });
    });

    return MenuListAll;
  };

  const fetchMenuList = useCallback(async () => {
    const { result, status } = await getMenuByUser();
    if (status) {
      setMenuList(result.data);
      dispatch(
        setUserItem({
          menuList: initMenuListAll(result.data),
        }),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMenuList();
  }, [fetchMenuList]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;

      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse,
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    newUser && driverStart();
  }, [newUser]);

  return (
    <Layout className="layout-page">

      {/* <Layout> */}

      {!isMobile ? (
        <Sider
          className="layout-page-sider"
          trigger={null}
          collapsible
          style={{ backgroundColor: token.token.colorBgContainer }}
          collapsedWidth={isMobile ? 0 : 80}
          collapsed={collapsed}
          breakpoint="md"
        >
          <MenuComponent collapsed={collapsed} toggle={toggle}
            menuList={menuList}
            openKey={openKey}
            onChangeOpenKey={k => setOpenkey(k)}
            selectedKey={selectedKey}
            onChangeSelectedKey={k => setSelectedKey(k)}
          />
        </Sider>
      ) : (
        <Drawer
          width="200"
          placement="left"
          bodyStyle={{ padding: 0, height: '100%' }}
          closable={false}
          onClose={toggle}
          open={!collapsed}
        >
          <MenuComponent collapsed={collapsed} toggle={toggle}
            menuList={menuList}
            openKey={openKey}
            onChangeOpenKey={k => setOpenkey(k)}
            selectedKey={selectedKey}
            onChangeSelectedKey={k => setSelectedKey(k)}
          />
        </Drawer>
      )}

      {/* </Layout> */}
      <Layout>
        <HeaderComponent collapsed={collapsed} toggle={toggle} />
        <Content className="layout-page-content">
          <TagsView />
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
