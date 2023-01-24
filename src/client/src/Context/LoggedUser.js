import React from "react";

export const loggedUser = {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
};

export const LoggedUserContext = React.createContext();