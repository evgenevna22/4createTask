import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
export class AddUserModalComponent {
  private _uniqueValidator = inject(UniqueNameValidator);

  public userForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [
        this._uniqueValidator.validate.bind(this._uniqueValidator),
      ],
    }),
    active: new FormControl(false),
  });
}
