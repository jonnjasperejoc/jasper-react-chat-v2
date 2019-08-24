import { combineReducers } from 'redux';
import chatReducer from "../reducers/chat";

export default combineReducers({
    chat: chatReducer
});