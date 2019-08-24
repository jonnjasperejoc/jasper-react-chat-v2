import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: "",
            unameDisabled: false,
            pwordDisabled: false,
            loginBtnDisabled: false,
            loginBtnText: "Sign up / Login",
            nameDisabled: false,
            nameRequired: false,
            showName: false
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token || token !== null) {
            this.props.history.push('/chat');
        }
    }


    onSubmit = e => {
        e.preventDefault();

        if (this.state.showName) {
            this.signUp(e);
            return false;
        }

        const user = {
            username: e.target.elements.username.value.trim(),
            password: e.target.elements.password.value.trim()
        }

        this.setState({
            unameDisabled: true,
            pwordDisabled: true,
            loginBtnDisabled: true,
            nameDisabled: true,
        });

        axios
            .post('/api/users/login', user)
            .then(res => {
                localStorage.setItem('token', res.data.token + '|' + res.data.user.name + '|' + res.data.user.id + '|' + res.data.user.username);
                this.setState({
                    unameDisabled: false,
                    pwordDisabled: false,
                    loginBtnDisabled: false,
                    nameDisabled: true,
                });
                this.props.history.push('/chat');
            })
            .catch(err => {
                if (err.response.data.msg === "User does not exist") {
                    this.setState({
                        errorMessage: err.response.data.msg + ", create it now?",
                        loginBtnText: "Sign up",
                        nameRequired: true,
                        showName: true,
                        unameDisabled: false,
                        pwordDisabled: false,
                        loginBtnDisabled: false,
                        nameDisabled: false,
                    });
                } else {
                    this.setState({
                        errorMessage: err.response.data.msg,
                        unameDisabled: false,
                        pwordDisabled: false,
                        loginBtnDisabled: false,
                        nameDisabled: false,
                    });
                }
            });
    }

    signUp = (e) => {
        this.setState({
            unameDisabled: true,
            pwordDisabled: true,
            loginBtnDisabled: true,
            nameDisabled: true,
        });

        const user = {
            name: e.target.elements.name.value.trim(),
            username: e.target.elements.username.value.trim(),
            password: e.target.elements.password.value.trim()
        }

        axios
            .post('/api/users', user)
            .then(res => {
                localStorage.setItem('token', res.data.token + '|' + res.data.user.name + '|' + res.data.user.id + '|' + res.data.user.username);
                this.setState({
                    unameDisabled: false,
                    pwordDisabled: false,
                    loginBtnDisabled: false,
                    nameDisabled: false,
                });
                this.props.history.push('/chat');
            })
            .catch(err => {
                if (err.response.data.msg) {
                    this.setState({
                        errorMessage: err.response.data.msg,
                        unameDisabled: false,
                        pwordDisabled: false,
                        loginBtnDisabled: false,
                        nameDisabled: false,
                    });

                }
            });
    }

    render() {
        return (
            <div className="row">
                <div className="appHeader">
                    <h3 className="appName">Chat app</h3>
                </div>
                <form onSubmit={this.onSubmit} id="login-form">
                    <div className={this.state.errorMessage ? "alert alert-danger" : "hidden"}>{this.state.errorMessage}</div>
                    <div className={this.state.showName ? "form-group" : "hidden"} >
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required={this.state.nameRequired}
                            disabled={this.state.nameDisabled}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="User name"
                            required
                            disabled={this.state.unameDisabled}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            required
                            disabled={this.state.pwordDisabled}
                        />
                    </div>
                    <div className="form-group">
                        <button className="primary block" disabled={this.state.loginBtnDisabled}>{this.state.loginBtnText}</button>
                    </div>
                    <div className="disclaimer">
                        By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. Others will be able to find you by searching for your email address or phone number when provided.
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
