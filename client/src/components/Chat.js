import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getChats } from '../actions/chatActions';
import PropTypes from 'prop-types';

//Initialize Socket IO Client
import io from 'socket.io-client';
const socket = io();

class Chat extends Component {
    static propTypes = {
        getChats: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            id: null,
            name: "",
            username: "",
            message: "",
            messageDisabled: false,
            sendDisabled: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (!token || token === null) {
            this.props.history.push('/');
        } else {
            let tokenArr = token.split('|');

            this.setState({
                token: tokenArr[0],
                name: tokenArr[1],
                id: tokenArr[2],
                username: tokenArr[3]
            });

            socket.on("return_chats", chats => {
                this.props.getChats(chats);
                this.scrollToBottom();
            });

            const config = {
                headers: {
                    'token': tokenArr[0]
                }
            };

            axios
                .get('/api/chats', config)
                .then(res => {
                    this.props.getChats(res.data, res.data.length > this.props.chats.length);
                    this.scrollToBottom();
                })
                .catch(err => {
                    console.log(err.response.data, err.response.status)
                    this.handleLogout();
                })
        }
    }

    componentWillUnmount() {
        this.props.getChats(this.props.chats);
        this.scrollToBottom();
    }

    onSubmit = e => {
        e.preventDefault();

        const chat = {
            message: e.target.elements.message.value.trim(),
            owner: this.state.id,
            ownerName: this.state.name
        }

        const config = {
            headers: {
                'token': this.state.token
            }
        };

        this.setState({
            messageDisabled: true,
            sendDisabled: true
        });

        axios
            .post('/api/chats', chat, config)
            .then(res => {
                this.setState({
                    message: "",
                    messageDisabled: false,
                    sendDisabled: false
                });

                const chats = this.props.chats;
                chats.push({
                    _id: res.data._id,
                    message: chat.message,
                    owner: chat.owner,
                    ownerName: chat.ownerName
                });

                this.props.getChats(chats, true);
                socket.emit('receive_chats', this.props.chats, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

                this.scrollToBottom();
            })
            .catch(err => {
                this.setState({
                    messageDisabled: false,
                    sendDisabled: false
                });
                console.log(err.response.data, err.response.status)
                this.handleLogout();
            })
    }

    onChangeMessage = e => {
        this.setState({
            message: e.target.value
        });
    }

    scrollToBottom = () => {
        const bottom = document.getElementById("conversationBottom");
        bottom.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }

    handleLogout = () => {
        clearInterval(this.state.interval);
        localStorage.removeItem('token');
        this.props.history.push('/');
    }

    render() {
        const chats = this.props.chats;
        return (
            <div className="row">
                <div className="appHeader">
                    <h3 className="appName">Chat app
                    <button id="logout" onClick={this.handleLogout}>Log out</button>
                    </h3>
                </div>
                <div className="appConversation">
                    {chats.map(({ _id, message, owner, ownerName }) => (
                        <div className={this.state.id === owner ? "container _you" : "container not_you"} key={_id}>
                            <div className={this.state.id === owner ? "you" : "not-you"}>
                                {message}
                            </div>
                            <div className="name">{ownerName}</div>
                        </div>
                    ))}
                    <div id="conversationBottom"></div>
                </div>
                <div className="appFooter">
                    <form onSubmit={this.onSubmit}>
                        <input type="text" name="message" className="name" placeholder="Start a new message" onChange={this.onChangeMessage} value={this.state.message} disabled={this.state.messageDisabled} />
                        <button id="send" onClick={this.handleSend} disabled={this.state.sendDisabled}>send</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    chats: state.chat.chats
});

export default connect(
    mapStateToProps,
    { getChats }
)(Chat);