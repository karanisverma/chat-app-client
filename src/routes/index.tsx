import  React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Init from "../pages/init";
import Home from "../pages/home";
import Login from "../pages/login";
import Chat from "../pages/chat";
import { History } from "history";

interface data {
  status: Boolean
}

export class Routes extends React.Component {
  state = {
    loading: true 
  };

  handlePageFinish = (data:data, history:History) => {
    this.setState({ loading: false });
    if (data.status) {
      history.replace("/chat");
    } else {
      history.replace("/login");
    }
  };

  render() {
    return (
      <Router>
        <div style={{width: "100%"}}>
          <Route
            path="/"
            render={props => (
              <Init onFinish={this.handlePageFinish} {...props} />
            )}
          />
          {!this.state.loading ? (
            <div style={{width: "100%"}}>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/chat" component={Chat} />
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </Router>
    );
  }
}

export default Routes;
