import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, setUser } from "./store/userSlice.js";
import axiosInstance from "./apis/axios.js";
import { useDispatch } from "react-redux";
const { Header, Sider, Content } = Layout;

export const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchLogout = async () => {
    try {
      const response = await axiosInstance.post("logout");
      if (response.status === 200) {
        dispatch(setUser(null));
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={[
            {
              key: "/",
              icon: <AppstoreOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/"),
            },
            {
              key: "/products",
              icon: <UnorderedListOutlined />,
              label: "Products",
              onClick: () => navigate("/products"),
            },
            {
              key: "/chats",
              icon: <WechatOutlined />,
              label: "Chats",
              onClick: () => navigate("/chats"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Button
                onClick={fetchLogout}
                style={{
                  border: "1px solid black",
                  backgroundColor: "red",
                  color: "white",
                  margin: "20px",
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Button
                type="text"
                onClick={() => navigate("/login")}
                style={{
                  border: "1px solid black",
                  backgroundColor: "black",
                  color: "white",
                  margin: "20px",
                }}
              >
                Log In
              </Button>
            </>
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
