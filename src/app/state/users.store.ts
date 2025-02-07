import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '../models/user.interface';
import { LoadingState } from '../models/loading-state.interface';

export interface UsersState {
  users: User[],
  loadingState: LoadingState
}

export function createInitialState(): UsersState {
  return {
    users: [],
    loadingState: LoadingState.initial
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class UsersStore extends Store<UsersState> {
  constructor() {
    super(createInitialState());
  }
}
