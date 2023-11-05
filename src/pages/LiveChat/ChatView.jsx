import React, { useEffect } from "react";
import classes from "./LiveChat.module.css";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ChatInput } from "./components/ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { selectChatState, updateChatDetail } from "../../store/chatSlice";

export const ChatView = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { chatList } = useSelector(selectChatState);

  const chatDetail = chatList?.find((chat) => chat._id === chatId);

  useEffect(() => {
    global.socketInstance.on("new-message", (message) => {
      if (message.authorType === "Client") {
        dispatch(updateChatDetail({ chatId: chatId, message: message }));
      }
    });

    return () => {
      global.socketInstance.off("new-message");
    };
  }, [chatId, dispatch]);

  return (
    <>
      <div className={classes["chat-view-wrapper"]}>
        {chatDetail?.messages.map((message) => {
          return (
            <MessageItemStyled key={message._id} $message={message}>
              {message.authorType === "Client" ? " Client:" : ""}
              {message.content} {message.authorType === "Admin" ? " :You" : ""}
            </MessageItemStyled>
          );
        })}
      </div>
      <ChatInput />
    </>
  );
};

const MessageItemStyled = styled.div`
  margin-top: 8px;
  text-align: ${(props) =>
    props?.$message?.authorType === "Admin" ? "right" : "left"};
`;
