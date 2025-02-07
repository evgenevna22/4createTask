import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { UsersStore } from './users.store';
import { UsersApiService } from '../services/users-api.service';
import { LoadingState } from '../models/loading-state.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersSevice {
  private _api = inject(UsersApiService);
  private _store = inject(UsersStore);

  public loadUsers(): Observable<User[]> {
    this._store.update({ loadingState: LoadingState.loading });
    return this._api.getUsers().pipe(
      tap((users) => {
        this._store.update({ loadingState: LoadingState.loaded });
        return this._store.update({ users });
      }),
      catchError((error: Error) => {
        this._store.setError(error);
        this._store.update({ loadingState: LoadingState.failed });
        return throwError(() => new Error(error?.message));
      })
    );
  }

  public toggleActiveFlag(id: number, active: boolean): Observable<void> {
    return this._api.updateUserActiveFlag(id, active);
  }

  public addUser(user: Omit<User, 'id'>): Observable<void> {
    return this._api.addUser(user);
  }

  public isNameTaken(name: string): Observable<boolean> {
    return this._api.isNameTaken(name);
  }
}
