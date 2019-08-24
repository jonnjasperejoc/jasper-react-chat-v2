// Chats Reducer
const defaultState = {
    chats: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "GET_CHATS":
            return {
                ...state,
                chats: action.chats
            };
        default:
            return state;
    }
};
