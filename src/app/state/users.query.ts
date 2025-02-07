import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UsersStore, UsersState } from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends Query<UsersState> {
  public users$ = this.select('users');
  
  constructor(protected override store: UsersStore) {
    super(store);
  }
}