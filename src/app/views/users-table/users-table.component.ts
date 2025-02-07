import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersSevice } from '../../state/users.service';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { UsersQuery } from '../../state/users.query';
import { User } from '../../models/user.interface';
import { LoadingState } from '../../models/loading-state.interface';
import { AddUserModalComponent } from '../../components/add-user-modal/add-user-modal.component';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent implements OnInit, OnDestroy {
  private _query = inject(UsersQuery);
  private _service = inject(UsersSevice);
  private _dialog = inject(MatDialog);
  private _unsubscribe$ = new Subject<void>();

  public users$: Observable<User[]> = this._query.select('users');
  public updatedUserId$ = new BehaviorSubject<number | null>(null);
  public loadingState$: Observable<LoadingState> =
    this._query.select('loadingState');
  public isAddingAvailable$ = this._query.select('users').pipe(
    filter((users) => !!users.length),
    tap((users) => console.log('users:', users.length)),
    tap((users) =>
      console.log(
        'users every:',
        users.every((user) => !user.active)
      )
    ),
    map((users) => users.length > 5 && users.some((user) => !user.active))
  );

  public displayedColumns = ['id', 'name', 'active'];
  @ViewChild(MatTable) private _table!: MatTable<User>;

  public loadingStateEnum = LoadingState;

  ngOnInit(): void {
    this._service
      .loadUsers()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(console.log); // todo: remove

      this._query.select('users').subscribe(res => console.log('ngOnInit this._query.select(users): ', res));
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public toggleActivity(user: User): void {
    this.updatedUserId$.next(user.id);

    this._service
      .toggleActiveFlag(user.id, !user.active)
      .pipe(
        switchMap(() => this._service.loadUsers()),
        takeUntil(this._unsubscribe$)
      )
      .subscribe();
  }

  public addUser(): void {
    this._dialog
      .open(AddUserModalComponent)
      .afterClosed()
      .pipe(
        filter((user: Omit<User, 'id'>) => !!user),
        switchMap((user: Omit<User, 'id'>) => this._service.addUser(user)),
        switchMap(() => this._service.loadUsers()),
        takeUntil(this._unsubscribe$)
      )
      .subscribe(() => {
        this._table.renderRows();
        console.log('addUser() subsc')
      });
  }

  public trackByFn(index: number, user: User): number {
    return user.id;
  }
}
