import  React, { InputHTMLAttributes } from "react";
import io from "socket.io-client";
import './chat.scss'

import EmojiPicker from 'emoji-picker-react';
// import update from 'react-addons-update';
interface chatMessage {
  sender: string
  message: string
  room_id: string
  seen: Boolean
}
interface typingNotification {
  sender: string,
  isTyping: Boolean
}
interface user {
  name: string,
  id: string
}
interface room {
  id: string
  socket?: SocketIOClient.Socket
}
interface roomSocket {
  socket: SocketIOClient.Socket
}
interface rooms {
  [name: string]: roomSocket
}
interface conversations {
  [name:string]: Array<chatMessage>
}
interface S {
  message: string,
  currentUser: user,
  conversation: Array<chatMessage>
  conversations: conversations
  isSomeOneTyping: Boolean
  typingUser: string
  isEmojiSelectorVisible: Boolean
  users: Array<user>
  chatRooms: rooms
  currentRoom: room
};

interface P {
  history: History
}
class Chat extends React.Component<P, S> {
  constructor(props:P){
    super(props);
    this.state = {
      message:'',
      currentUser: JSON.parse(this.getCookie('userInfo')),
      conversation: [],
      conversations: {},
      isSomeOneTyping: false,
      typingUser: '',
      users: [],
      isEmojiSelectorVisible: false,
      chatRooms: {},
      // currentRoom:{id:'chatRoom-19-6', socket:this.state.chatRooms['chatRoom-19-6'].socket},
      currentRoom:{id:'chatRoom-19-6'},
    };
  }
  changeRoom = () =>{
    console.log('room change function called...')
    this.setState({
      conversation: this.state.conversations[`${this.state.currentRoom.id}`]
    })
  }
  handleMessageInput = (e) => {
    const input = e.target.value;    
    this.setState(
      {
        message: input,
      }
    )
    this.state.currentRoom.socket.emit('typing', {sender: this.state.currentUser.name, isTyping: true})
  } 
  static defaultProps = {
  };
  sendMessage = () => {
    // because user should not be able to send message with empty body.
    if (this.state.message.length === 0) {
      return
    }
    this.state.currentRoom.socket.emit('typing', {sender: this.state.currentUser.name, isTyping: false})
    this.state.currentRoom.socket.emit('message', 
      {
        sender: this.state.currentUser.name, 
        message: this.state.message, 
        room_id: this.state.currentRoom.id,
        seen: false
      })
    this.setState(
      {
      message: ''
    }
  )
  }
handleEmojiToggle = (): void => {
  this.setState({
    isEmojiSelectorVisible: !this.state.isEmojiSelectorVisible
  })
}
handleEmojiInput = (e:string, info, event) => {
  console.log('curosr locations -->', event.traget)
  console.log('curosr locations -->', info)
  // console.log('curosr event -->', event)
  let newMessage = this.state.message + ' ' + String.fromCodePoint(parseInt(`0x${e}`,16))
  this.setState({
    message: newMessage
  })
}
createRoom = (roomNumber:string) => {
  return io('localhost:3000/chat',{
    query: 'room_number=' + roomNumber
  });
}
getCookie = (name: string): string => {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || '';
  }
  componentDidMount() {
    fetch('http://localhost:3000/all_users', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'get'
    }).then(res => res.json()).then(res => {
      console.log('all user data -->', res)
      console.log('current user ->', this.state.currentUser.id)
      res.users.map((user:user) => {
        let roomName = this.getRoomName(this.state.currentUser.id, user.id)
        let chatRoom = this.createRoom(roomName)
        // init converstaion to empty string so that it won't throw key erro while fetcing info in changeRoom function call.
        this.setState({
          chatRooms: {...this.state.chatRooms, [roomName]:{socket:chatRoom}},
          conversations: {...this.state.conversations, [roomName]:[]}
        })
      })

      let currentRoomName = this.getRoomName(this.state.currentUser.id, this.state.currentUser.id)
      this.setState({
        users: res.users,
        currentRoom: {id:currentRoomName, socket:this.state.chatRooms[`${currentRoomName}`].socket}
      }, ()=> this.startListening())
    })  
  }
  startListening = () => {
    Object.keys(this.state.chatRooms).map(room => {
      this.state.chatRooms[room].socket.on('newMessage',(chatMessage:chatMessage) => {
        console.log('new message recived from-->', chatMessage.room_id)
        // because user chat count should not increase of room
        // when sender and reciver are on same room.
        if (chatMessage.room_id === this.state.currentRoom.id) {
          chatMessage = {...chatMessage, seen:true} 
        }
        this.setState(state => {
          const conversation = [...state.conversations[chatMessage.room_id], chatMessage];
          const conversations = {
            ...state.conversations,
              [chatMessage.room_id]: conversation
          }
          return {
            conversations,
            conversation: conversations[`${this.state.currentRoom.id}`],
          }
      }, () => {
          console.log('room id-->', this.state.currentRoom.id)
          console.log('conversation-->', this.state.conversation)
          console.log('converstaions--->', this.state.conversations)
        })
        
      })

    this.state.chatRooms[room].socket.on('userTyping', (info:typingNotification) => {
      if (this.state.currentUser.name !== info.sender){
        this.setState({
          isSomeOneTyping: info.isTyping,
          typingUser: info.sender
        })
      }
    })
  })
  }
  getUnreadMessages = (reciverId:string) => {
    return this.state.conversations[this.getRoomName(reciverId, this.state.currentUser.id)].filter(chat=> {return chat.seen === false}).length
  }
  handleRoomChange = (reciverId:string) =>{
    // because if user click multiple times on already connected room, 
    // it create multiple instance of socket.
    if(this.state.currentRoom.id.split('-').indexOf(reciverId.toString()) > 0) return
    let newRoomName = this.getRoomName(reciverId.toString(), this.state.currentUser.id)
    let converstaion = this.state.conversations[newRoomName]
    converstaion = converstaion.map(chat => Object.assign({}, chat, chat.seen=true))
    const conversations = {
      ...this.state.conversations,
        [newRoomName]: converstaion
    }
    this.state.conversations[newRoomName]
    this.setState({
      currentRoom: {id:newRoomName, socket:this.state.chatRooms[`${newRoomName}`].socket} 
    }, () => this.changeRoom())
  }
  getRoomName (roomNumber1:string, roomNumber2:string):string {
    return roomNumber1 > roomNumber2 ? `chatRoom-${roomNumber1}-${roomNumber2}` : `chatRoom-${roomNumber2}-${roomNumber1}`      
  }
  render() {
    return (
    <div className="chatAppContainer">
      <div className="chatNavigation">
        <div className="chatNavigationHeader">
          Chat navigation header
        </div>
        <div className="userNameWrapper">
        {this.state.users.map((user) => (
          this.state.currentUser.id!==user.id?
            <p 
              id={user.id} 
              onClick={() => this.handleRoomChange(user.id)}
              className={"userName " + (this.state.currentRoom.id.split('-').indexOf(user.id.toString())>0 ? 'activeChat' : '')}
              >
              {user.name}
           
              {
                this.getUnreadMessages(user.id.toString()) > 0 
                ? 
                <span className="unreadMessage">  {this.getUnreadMessages(user.id.toString())} </span>
                :
                ''
              }
           
            </p>
            :
            ''
          ))
        }
        </div>
      </div>
    <div className="chatWrapper">
      <div className="chatMessageHeader">
        Chat message header will come here
      </div>
      <div className="chatContainer">
        {this.state.conversation.map((cMessage, index) => (
        <section className={"messageContainer " + ((cMessage.sender === this.state.currentUser.name) ? 'currentUser' : '')} key={index}>
          <p className="userName">
            {cMessage.sender}
          </p>
          <p className="message">
            {cMessage.message}
          </p>
      </section>
      ))}
    </div>
    <p className="typingNotification">{this.state.isSomeOneTyping? `${this.state.typingUser} is typing something....`: ``}</p>
    
    <div className="emojiPicker">
    {this.state.isEmojiSelectorVisible ? <EmojiPicker preload onEmojiClick={this.handleEmojiInput}/> : ''}
    </div> 
    <div className="messageInputWrapper">
    <img src={require("assets/img/happy.png")}  onClick={this.handleEmojiToggle}/>
    <input 
      type="text" 
      onKeyPress={e => e.key == 'Enter' ? this.sendMessage() : null}
      onChange={this.handleMessageInput}
      value={this.state.message}
    ></input>
    <img src={require("assets/img/send.png")}  
      onClick={this.sendMessage}/> 
    </div>
    </div>
    </div>
    );
  };
}



export default Chat
