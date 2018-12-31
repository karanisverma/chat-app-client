import  React from "react";
import "./login.scss";
import { History } from "history";

interface P {
  history: History
}

interface InputE {
  target: {
    name: String,
    value: String,
  }
}

interface S {
  qrImage: String,
  email: String,
  otp: String,
  showOtp: Boolean,
};

class Login extends React.Component<P, S> {
  static displayName = "page-login";
  state = {
    email: "",
    otp: "",
    showOtp: false,
    qrImage: ""
  };

  static defaultProps = {};

  handleOtp = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    this.setState({
      otp: input.value
    });
  };

  handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    this.setState({
      email: input.value
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.showOtp) {
      fetch("http://localhost:3000/submit_otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          otp: this.state.otp,
          email: this.state.email
        })
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.msg) {
            this.props.history.replace("/chat");
          } else {
            alert("Error");
          }
          this.setState({
            showOtp: false
          });
        });
    } else {
      fetch("http://localhost:3000/otp?email=" + this.state.email)
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.user_exist) {
            this.setState({
              showOtp: true
            });
          } else if (data.image) {
            this.setState({
              qrImage: data.image,
              showOtp: true
            });
          }
        });
    }
  };
  generateQRCode = () => {
    fetch(`http://localhost:3000/generate_qr_code?email=${this.state.email}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          qrImage: data.image,
          showOtp: true
        });
      });
  };
  render() {
    return (
      <div className="login-modal">
        <div className="login-form">
          <h1>Congratulations, welcome on board!</h1>
          <form onSubmit={this.handleSubmit}>
            {this.state.showOtp ? (
              <input
                key="otp"
                placeholder="Enter otp"
                type="text"
                name="otp"
                onChange={this.handleOtp}
              />
            ) : (
              <input
                key="email"
                type="text"
                name="email"
                placeholder="Enter email id"
                value={this.state.email}
                onChange={this.handleEmail}
              />
            )}
            <a onClick={this.generateQRCode}>Generate QR code again</a>
            <button>Submit</button>
          </form>
          <div className="footer">Copyright Zoomcar</div>
        </div>
        <div>
          <img src={this.state.qrImage} />
        </div>
        <div className="login-splash">
          <img src={require("assets/img/loginImg.jpg")} />
        </div>
      </div>
    );
  }
}

export default Login;
