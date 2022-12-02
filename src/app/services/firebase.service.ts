import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseTokenService } from './firebase-token.service';
import { Constants } from '../shared/constants/constants';

@Injectable()
export class FirebaseService {
  currentMessage = new BehaviorSubject(null);

  constructor(private firebaseMessaging: AngularFireMessaging, private firebaseTokenService: FirebaseTokenService) {
    this.firebaseMessaging.onMessage((_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  requestPermission() {
    this.firebaseMessaging.requestToken.subscribe(
      (token: any) => {
        this.firebaseTokenService.save({ keyword: token }).subscribe((res) => {
          localStorage.setItem(Constants.FIREBASE_TOKEN, token);
        });
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.firebaseMessaging.messages.subscribe((payload : any) => {
      console.log(payload);
      this.currentMessage.next(payload);
    });
  }
}
