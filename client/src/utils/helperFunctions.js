const getUserAvatar = (user = "Abhi") => {
    user = user.toLowerCase().trim();

    let url = `https://api.dicebear.com/8.x/avataaars/svg?seed=${user}`;
    return url;
};

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export { getUserAvatar, capitalize };
