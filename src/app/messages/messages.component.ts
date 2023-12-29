import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  showMessages = false;

  errors$:Observable<string[]>;

  // Constructor
  constructor(public messagesService:MessagesService) {
    console.log("Created messaging component");
  }

  ngOnInit() {
    // Set this errors to the message service's one and set to true
    this.errors$ = this.messagesService.errors$.pipe(
      tap(() => this.showMessages = true)
    );
  }

  // Function sets showMessages which ngIf uses
  // to hide the component or show it
  onClose() {
    this.showMessages = false;
  }

}
