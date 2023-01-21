import React, { createContext, useState, useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";
import PropTypes from 'prop-types';
import { postSession, postGuestSession, deleteSession } from "../../apis/session";

export const SessionContext = createContext();

export const SessionProvider = (props) => {
  const { children } = props;

  const[cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const [sessionState, setSessionState] = useState({
    isOpenLoginDialog: true,
    isOpenLogoutDialog: false,
    loginUser: null,
    message: null,
  });
  const [errors, setErrors] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();

  const createLoginFormData = () => {
    const formData = new FormData();
    // nullは送信する．presenceバリデーションエラーを表示するため．
    // undefinedは送信しない．データが"undefined"に更新されてしまうため．
    if (userName !== undefined) formData.append("user_name", userName);
    if (userEmail !== undefined) formData.append("email", userEmail);
    if (userPassword !== undefined) formData.append("password", userPassword);
    return formData
  };

  const login = () => {
    const formData = createLoginFormData();

    postSession({formData})
    .then((data) => {
      if (data.message) {
        setSessionState({
          ...sessionState,
          isOpenLoginDialog: false,
          loginUser: data.user,
          message: data.message,
        })
        setCookie("user_id", data.user)
        setErrors()
        setUserName()
        setUserEmail()
        setUserPassword()
      } else {
        setErrors(data.error_messages)
      }
    });
  };

  const guestLogin = () => {
    postGuestSession()
    .then((data) => {
      if (data.message) {
        setSessionState({
          ...sessionState,
          isOpenLoginDialog: false,
          loginUser: data.user,
          message: data.message,
        })
        setCookie("user_id", data.user)
        setErrors()
        setUserName()
        setUserEmail()
        setUserPassword()
      } else {
        setErrors(data.error_messages)
      }
    });
  };

  const logout = () => {
    deleteSession(sessionState.loginUser)
    .then((data) => {
      removeCookie("user_id")
      setSessionState({
        isOpenLoginDialog: true,
        isOpenLogoutDialog: false,
        loginUser: null,
        message: data.message,
      })
    });
  };

  const checkLogin = () => {
    if (cookies.user_id) {
      setSessionState({
        ...sessionState,
        isOpenLoginDialog: false,
        loginUser: cookies.user_id,
        message: `cookieは「${cookies.user_id.user_name}」です．`
      })
  } else {
      setSessionState({
        ...sessionState,
        isOpenLoginDialog: true,
        loginUser: null,
      })
    }
  };

  useEffect(checkLogin, []);

  const value = useMemo(() => ({
    sessionState,
    setSessionState,
    errors,
    setErrors,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    login,
    guestLogin,
    logout,
  }), [
    sessionState,
    setSessionState,
    errors,
    setErrors,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    login,
    guestLogin,
    logout,
  ]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
};

SessionProvider.propTypes = {
  children: PropTypes.objectOf.isRequired,
};
