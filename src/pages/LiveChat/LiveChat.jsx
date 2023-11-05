import { Col, Input, Row } from "antd";
import React from "react";
import classes from "./LiveChat.module.css";
import { ChatList } from "./components/ChatList";
import { Outlet } from "react-router-dom";

const LiveChat = () => {
  return (
    <div style={{ height: "100%" }}>
      <h3>Chat</h3>
      <Row className={classes["content-wrapper"]}>
        <Col className={classes["left-content"]} span={4}>
          <div className={classes["input-wrapper"]}>
            <Input placeholder="Search Contact" />
          </div>
          <ChatList />
        </Col>
        <Col className={classes["right-content"]} span={20}>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default LiveChat;
