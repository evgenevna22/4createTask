import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UniqueNameValidator } from 'src/app/utils/validators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserModalComponent implements OnInit, OnDestroy {
  private _uniqueValidator = inject(UniqueNameValidator);
  private _cdRef = inject(ChangeDetectorRef);

  private _unsubscribe$ = new Subject<void>();

  public userForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [
        this._uniqueValidator.validate.bind(this._uniqueValidator),
      ],
      updateOn: 'blur',
    }),
    active: new FormControl(false),
  });

  ngOnInit(): void {
    // due to this Angular issue I used this hack, check for more details https://github.com/angular/angular/issues/44295
    this.userForm.statusChanges
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => this._cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
