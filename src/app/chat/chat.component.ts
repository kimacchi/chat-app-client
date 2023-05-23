import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { Observable, last, tap } from 'rxjs';
import { logout } from '../counter.actions';
import * as io from "socket.io-client"

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

  myMsg = "break-words max-w-4xl h-min p-4 bg-slate-700 bg-opacity-40 rounded-3xl rounded-br-none self-end"
  otherMsg = "break-words max-w-4xl h-min p-4 bg-slate-700 bg-opacity-40 rounded-3xl rounded-bl-none"

  constructor(private store: Store<{username: string}>){
    this.username$ = store.select("username").pipe(tap((e) => {
      this.lastUsername = e;
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

}
