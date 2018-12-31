import  React from "react";
import { History } from "history";

type P = {
  onFinish: Function,
  history: History
}

type S = {

}

class Init extends React.Component<P, S> {
  state = {

  }

  componentDidMount() {
    fetch('http://localhost:3000/is_loggedin', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post'
    }).then(res => res.json()).then(res => {
      this.setCookie('userInfo', JSON.stringify(res), 1)
      this.props.onFinish(res, this.props.history);
    })  
  }
  
  static defaultProps = {
  }
  setCookie = (name: string, value: string, expireDays: number, path: string = '') => {
    let d:Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    let cpath:string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
}


  render():null {
    return null;
  }
}


export default Init;
