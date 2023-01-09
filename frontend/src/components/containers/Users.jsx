import React, { useReducer, useEffect, useState } from "react";
import { fetchUsersIndex } from "../../apis/users";
import { REQUEST_STATE } from "../../constants";
import { initialUsersState, usersActionTypes, usersReducer } from "../../reducers/users";

// components
import { UsersIndex } from '../presentations/UsersIndex.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Users = () => {
  const initialState = {
    isOpenUserDialog: false,
    selectedUser: null,
  };
  const [state, setState] = useState(initialState);
  const [usersState, dispatch] = useReducer(usersReducer, initialUsersState)

  useEffect(() => {
    dispatch({ type: usersActionTypes.FETCHING });
    fetchUsersIndex()
    .then((data) =>
      dispatch({
        type: usersActionTypes.FETCH_SUCCESS,
        payload: {
          users: data.users
        }
      })
    )
  }, []);

  return (
    <>
      {
        usersState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        usersState.usersList.map((user) =>
          <div key={user.id}>
            <UsersIndex
              user={user}
              onClickUser={() =>
                setState({
                  ...state,
                  isOpenUserDialog: true,
                  selectedUser: user,
                })
              }
            />
          </div>
        )
      }
      {
        state.isOpenUserDialog &&
        <UserDialog
          isOpen={state.isOpenUserDialog}
          user={state.selectedUser}
          onClose={() =>
            setState({
              ...state,
              isOpenUserDialog: false,
              selectedUser: null,
            })
          }
        />
      }
    </>
  );
}
