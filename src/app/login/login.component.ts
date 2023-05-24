import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { increment, decrement, reset } from '../counter.actions';
import { login } from '../counter.actions';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username$: Observable<string>;
  username: string = "";
  visible: boolean = false;

  constructor(private store: Store<{username: string}>, private router: Router){
    this.username$ = store.select("username");
  }

  onInput(event: Event){
    this.username = (<HTMLInputElement>event.target).value;
  }

  login() {
    this.store.dispatch(login({value: this.username}));
    axios.post("http://localhost:4545/users", {
      "username": this.username
    }).then(e=>{
      console.log(e, "dsfgsd");
      this.router.navigate(["/chat"]);
    }).catch((e) => {
      console.log("error", e)
    })
  }

  showDialog(){
    this.visible = true;
  }


}
