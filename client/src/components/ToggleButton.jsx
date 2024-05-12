import PropTypes from "prop-types";
import React from "react";
import axios from "axios";
import styled from "styled-components";
import { updateStatus } from "../utils/APIRoutes";

// Styled button component
const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 48px;
    height: 24px;
    border-radius: 9999px;
    outline: none;
    background-color: ${(props) => (!props.state ? "#38b000" : "#A0AEC0")};
    cursor: "pointer";
    border-color: transparent;
    }
`;

// Styled span component
const StyledSpan = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 9999px;
    transition: transform 0.3s ease;
    transform: ${(props) =>
        props.state ? "translateX(-12px)" : "translate(12px)"};
`;

const ToggleButton = ({ state, setState }) => {
    const toggleButton = async () => {
        setState((prev) => !prev);
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        await axios
            .post(updateStatus, {
                id: data._id,
                status: state ? "AVAILABLE" : "BUSY",
            })
            .then((res) => {
                // update value in localStorage
                console.log(res.data);
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify({
                        ...data,
                        status: state ? "AVAILABLE" : "BUSY",
                    })
                );
            });
    };

    return (
        <StyledButton state={state} onClick={toggleButton} type="button">
            <StyledSpan state={state} />
        </StyledButton>
    );
};

// PropTypes definition
ToggleButton.propTypes = {
    state: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
};

export default ToggleButton;
