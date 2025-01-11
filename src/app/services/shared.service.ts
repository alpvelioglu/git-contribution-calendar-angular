import { Injectable, signal } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  gitHubUser = signal<User | null>(null);
  bitbucketUser = signal<User | null>(null);

  preferedDisplay = signal<User | null>(null);
  renderUI = signal<boolean>(true);
}
