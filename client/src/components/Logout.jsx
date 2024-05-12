import { BiPowerOff } from "react-icons/bi";
import React from "react";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
export default function Logout() {
    const navigate = useNavigate();
    const handleClick = async () => {
        const id = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
        const data = await axios.get(`${logoutRoute}/${id}`);
        if (data.status === 200) {
            localStorage.clear();
            navigate("/login");
        }
    };
    return (
        <Button onClick={handleClick}>
            <BiPowerOff />
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color:  #FF1493;
    border: none;
    cursor: pointer;
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`;
