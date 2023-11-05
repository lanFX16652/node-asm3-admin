import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../../apis/axios";
import { Typography } from "antd";
import { styled } from "styled-components";
import { selectChatState, updateChatList } from "../../../store/chatSlice";
import { useNavigate } from "react-router-dom";

export const ChatList = () => {
  const { chatList } = useSelector(selectChatState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/chat/list")
      .then((response) => {
        dispatch(updateChatList({ data: response.data, type: "array" }));
      })
      .catch((err) => {
        console.log(err);
      });

    const onChatCreate = (data) => {
      dispatch(updateChatList({ data: data, type: "object" }));
    };

    global.socketInstance.on("chat-created", onChatCreate);

    return () => {
      global.socketInstance.off("chat-created", onChatCreate);
    };
  }, [dispatch]);

  return (
    <div>
      {chatList?.map((chat) => {
        return (
          <ChatItem key={chat._id} onClick={() => navigate(`${chat._id}`)}>
            <Typography.Text ellipsis={{ tooltip: true }}>
              {chat._id}
            </Typography.Text>
          </ChatItem>
        );
      })}
    </div>
  );
};

const ChatItem = styled.div`
  padding: 10px 6px;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;
