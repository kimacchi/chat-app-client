import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { increment, decrement, reset } from '../counter.actions';
import { login } from '../counter.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username$: Observable<string>;
  username: string = "";

  constructor(private store: Store<{username: string}>){
    this.username$ = store.select("username");
  }

  onInput(event: Event){
    this.username = (<HTMLInputElement>event.target).value;
  }

  increment() {
    this.store.dispatch(login({value: this.username}));
  }


}
