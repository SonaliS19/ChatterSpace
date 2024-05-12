/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { allUsersRoute, host } from "../utils/APIRoutes";

import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem(
                            process.env.REACT_APP_LOCALHOST_KEY
                        )
                    )
                );
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const getContacts = async () => {
            if (currentUser) {
                const data = await axios.get(
                    `${allUsersRoute}/${currentUser._id}`
                );
                setContacts(data.data);
            } else {
                navigate("/");
            }
        };
        getContacts();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts
                        contacts={contacts}
                        changeChat={handleChatChange}
                    />
                    {currentChat === undefined ? (
                        <Welcome />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            socket={socket}
                        />
                    )}
                </div>
            </Container>
        </>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #ffff;
    .container {
        height: 90vh;
        width: 90vw;
        background-color: #00000876;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`;
