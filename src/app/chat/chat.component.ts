import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, last, tap } from 'rxjs';
import { logout } from '../counter.actions';
import * as io from "socket.io-client"
import axios from 'axios';

type Message = {
  collectionId: string,
  collectionName: string,
  created: string,
  from: User,
  id: string,
  text: string,
  updated: string,
  expand: {}
}

type Chat = {
  collectionId: string,
  collectionName: string,
  created: string;
  id: string,
  messages: Message[],
  to: User,
  updated: string,
  expand: {
    messages: Message[]
  }
}

type User = {
  id: string,
  updated: string,
  username: string,
  collectionId: string,
  collectionName: string,
  created: string,
  activeChats: string[]
  expand: {
    activeChats: Chat[]
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username$: Observable<string>;
  message: string;
  messageList: {message: string, username: string, self: boolean}[] = [];
  socket: any;
  lastUsername: string = "";
  userList: Array<string> = [];
  roomName: string = "";
  users: Array<User> = []
  selectedUser: User | null = null;
  thisUser: User | null = null;

  myMsg = "break-words max-w-4xl h-min p-4 bg-slate-700 bg-opacity-40 rounded-3xl rounded-br-none self-end"
  otherMsg = "break-words max-w-4xl h-min p-4 bg-slate-700 bg-opacity-40 rounded-3xl rounded-bl-none"

  constructor(private store: Store<{username: string}>, private router: Router){
    this.username$ = store.select("username").pipe(tap((e) => {
      this.lastUsername = e;
      if(!e){
        this.router.navigate(["/"])
      }
      axios.get("http://localhost:4545/users/?username="+e).then((ele) => {
        this.users = ele.data;
        console.log(ele.data);
      })
      axios.get("http://localhost:4545/user/?username="+e).then((ele) => {
        this.thisUser = ele.data;
        console.log("you are this", ele.data);
      })
    }));

    this.message = "";
    this.socket= io.io(`10.100.200.107:4545?username=${this.lastUsername}`)

    this.socket.emit("set-username", this.lastUsername)

    this.socket.on("user-list", (userList: string[])=>{
      this.userList = userList;
    })
    this.socket.on("message-broadcast", (data: {message: string, username: string}) => {
      if(data){
        this.messageList.push({message: data.message, username: data.username, self: false})
      }
    })

  }
  ngOnInit(): void {

  }


  onLogout(){
    this.store.dispatch(logout())
  }

  onTextChange(event: Event){
    this.message = (<HTMLInputElement>event.target).value;
  }

  onTextChangeRoom(event: Event){
    this.roomName = (<HTMLInputElement>event.target).value;
  }

  joinRoom(){
    const generatedRoomName = [this.roomName, this.lastUsername].sort().join("");
    this.socket.emit("join_chat", generatedRoomName);
  }

  sendMessage(){
    console.log(this.message);
    this.socket.emit("message", this.message);
    this.messageList.push({message: this.message, username: this.lastUsername, self: true})
    this.message = "";
  }

  selectUser(user: User){
    console.log("this is the user", user);
    this.selectedUser = user;
  }

}
