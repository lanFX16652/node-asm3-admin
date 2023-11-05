import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_WS_URL);
global.socketInstance = socket

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatList: [],
    },
    reducers: {
        setRoomData: (state, action) => {
            state.roomData = action.payload
        },
        updateChatList: (state, action) => {
            if (action.payload.type === 'object') {
                state.chatList = [...state.chatList, action.payload.data]
            } else if (action.payload.type === 'array') {
                state.chatList = [...state.chatList, ...action.payload.data]
            }
        },
        updateChatDetail: (state, action) => {
            state.chatList = state.chatList.map(chat => {
                if (chat._id === action.payload.chatId) {
                    return { ...chat, messages: [...chat.messages, action.payload.message] }
                }

                return chat
            })
        }
    }
})

export const selectChatState = (state) => state.chat
export const chatReducer = chatSlice.reducer
export const { setRoomData, updateChatList, updateChatDetail } = chatSlice.actions