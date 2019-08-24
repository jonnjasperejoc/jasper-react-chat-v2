import React from "react";

export default class NotFound extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="appHeader">
                    <h3 className="appName">Chat app</h3>
                </div>
                <h2 className="page-not-found">404 - Page not found!</h2>
            </div>
        );
    }
}
