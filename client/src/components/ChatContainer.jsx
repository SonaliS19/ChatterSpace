/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
    getLLMResponseRoute,
    getStatusRoute,
    receivedMessageRoute,
    sendMessageRoute,
} from "../utils/APIRoutes";

import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { getUserAvatar } from "../utils/helperFunctions";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );
            const response = await axios.post(receivedMessageRoute, {
                from: data._id,
                to: currentChat._id,
            });
            setMessages(response.data);
        };

        fetchMessages();
    }, [currentChat]);

    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                )._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);

    const addLLMResponseToChat = async () => {
        // send the message on the behalf of the receiver to sender
        const res = await axios.get(getLLMResponseRoute);
        const llmResponse = res.data.message;
        console.log("sending message to the sender", llmResponse);
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );

        // add the message to the database
        await axios.post(sendMessageRoute, {
            to: data._id,
            from: currentChat._id,
            message: llmResponse,
        });

        setMessages((prev) => [
            ...prev,
            { fromSelf: false, message: llmResponse },
        ]);
    };

    const handleSendMsg = async (msg) => {
        // check if the message is empty
        if (msg?.trim() === "" || !msg) return;

        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: data._id,
            msg,
        });
        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);

        // first check the status of the receiver
        const res = await axios.post(getStatusRoute, {
            id: currentChat._id,
        });

        console.log("status of the receiver", res.data.status);
        if (res.data.status === "BUSY") {
            // wait for 5 seconds before sending the message
            setTimeout(() => {
                addLLMResponseToChat();
            }, 5000);
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={getUserAvatar(currentChat.username)} alt="" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username.toUpperCase()}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <MessageItem msg={message} />
                        </div>
                    );
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const MessageItem = ({ msg }) => {
    const { message, fromSelf } = msg;

    const [text, setText] = useState(message);
    const [showFullMessage, setShowFullMessage] = useState(false);

    useEffect(() => {
        // if more than 50 words, truncate the message and show only 50 words
        if (message.split(" ").length > 50) {
            setText(message.split(" ").slice(0, 50).join(" "));
            setShowFullMessage(false);
        } else {
            setText(message);
            setShowFullMessage(true);
        }
    }, [message]);

    const showFullMessageHandler = () => {
        setText(message);
        setShowFullMessage(true);
    };
    return (
        <div className={`message ${fromSelf ? "send" : "received"}`}>
            <div className="content ">
                <p>{text}</p>
                {!showFullMessage && (
                    <button
                        onClick={showFullMessageHandler}
                        className="show-more"
                    >
                        Show more
                    </button>
                )}
            </div>
        </div>
    );
};

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #eee;
                @media screen and (min-width: 720px) and (max-width: 1080px) {
                    max-width: 70%;
                }
            }

            .show-more {
                background-color: transparent;
                color: white;
                cursor: pointer;
                border: none;
                border-radius: 0.2rem;
                padding: 4px 8px;

                :hover {
                    background-color: #ffffff39;
                }
            }
        }
        .send {
            justify-content: flex-end;
            .content {
                background-color: #FF1493;
            }
        }
        .received {
            justify-content: flex-start;
            .content {
                background-color: #FF1493;
            }
        }
    }
`;
