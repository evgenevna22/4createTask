import { Injectable } from '@angular/core';
import { delay, Observable, of, take } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private _users: User[] = [
    {
      id: 10,
      name: 'Holman Mccarthy',
      active: false,
    },
    {
      id: 7,
      name: 'Chandra Santana',
      active: false,
    },
    {
      id: 3,
      name: 'Hyde Tillman',
      active: false,
    },
  ];

  public getUsers(): Observable<User[]> {
    return of(this._users).pipe(
      delay(500),
      take(1)
    );
  }

  public updateUserActiveFlag(id: number, active: boolean): Observable<void> {
    this._users = this._users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          active
        }
      }
      return user;
    });
    return of(void 0);
  }

  public addUser(user: Omit<User, 'id'>): Observable<void> {
    this._users.push({
      ...user,
      id: Number(Date.now().toString())
    });
    console.log('addUser api service:', this._users);
    return of(void 0);
  }

  public isNameTaken(name: string): Observable<boolean> {
    return of(this._users.some(user => user.name.trim().toLowerCase() === name));
  }
}
