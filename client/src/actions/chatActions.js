export const getChats = (chats) => dispatch => {
    dispatch({
        type: "GET_CHATS",
        chats
    })
};
