const host = "http://localhost:5000";
const loginRoute = `${host}/api/auth/login`;
const registerRoute = `${host}/api/auth/register`;
const logoutRoute = `${host}/api/auth/logout`;
const allUsersRoute = `${host}/api/auth/allUsers`;
const getStatusRoute = `${host}/api/auth/getStatus`;
const updateStatus = `${host}/api/auth/updateStatus`;
const sendMessageRoute = `${host}/api/messages/addmsg`;
const receivedMessageRoute = `${host}/api/messages/getmsg`;
const getLLMResponseRoute = `${host}/api/messages/getLLMResponse`;

export {
    host,
    loginRoute,
    registerRoute,
    logoutRoute,
    allUsersRoute,
    getStatusRoute,
    updateStatus,
    sendMessageRoute,
    receivedMessageRoute,
    getLLMResponseRoute,
};
