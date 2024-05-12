/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { capitalize, getUserAvatar } from "../utils/helperFunctions";

import ToggleButton from "./ToggleButton";
import styled from "styled-components";

export default function Contacts({ contacts, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [toggle, setToggle] = useState(false);

    useEffect(async () => {
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUserName(data.username);
        setToggle(data.status === "BUSY");
    }, []);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <>
            {
                <Container>
                    <div className="brand">
                        <h3>ChatterSpace</h3>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact._id}
                                    className={`contact ${
                                        index === currentSelected
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changeCurrentChat(index, contact)
                                    }
                                >
                                    <div className="avatar">
                                        <img
                                            src={getUserAvatar(
                                                contact.username
                                            )}
                                            alt=""
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{capitalize(contact.username)}</h3>
                                    </div>
                                    <div
                                        className={`status ${
                                            contact.status === "BUSY"
                                                ? "busy"
                                                : "available"
                                        }`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={getUserAvatar(currentUserName)}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                        <ToggleButton state={toggle} setState={setToggle} />
                    </div>
                </Container>
            }
        </>
    );
}
const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    overflow: hidden;
    background-color: #ffc8dd;
    border-right: 1px solid #ffffff39;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #e29578;
            cursor: pointer;
            width: 90%;
            border-radius: 12px 16px;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.5s ease-in-out;
            .avatar {
                img {
                    height: 2.5rem;
                }
            }
            .username {
                flex: 1;
                h3 {
                    color: white;
                }
            }
            .status {
                height: 16px;
                width: 16px;
                border-radius: 50%;
                margin-right: 0.5rem;
                &.busy {
                    background-color: #ffff;
                }
                &.available {
                    background-color: #38b000;
                }
            }
        }
        .selected {
            background-color: #FF1493;
        }
    }

    .current-user {
        background-color: #FF1493;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        .avatar {
            img {
                height: 3rem;
                max-inline-size: 100%;
            }
        }
        .username {
            h2 {
                color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
    }
`;
