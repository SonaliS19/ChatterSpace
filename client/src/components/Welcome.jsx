import React, { useEffect, useState } from "react";

import Robot from "../assets/hello.gif";
import styled from "styled-components";

export default function Welcome() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async () => {
            let { username } = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );
            setUserName(username);
        };
        fetchUserName();
    }, []);

    return (
        <Container>
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Ready to chat, fam?</h3>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    img {
        height: 20rem;
    }
    span {
        color: #f50057;
    }
`;
