import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, catchError, of, finalize } from 'rxjs';
import { UsersSevice } from '../state/users.service';

@Injectable({ providedIn: 'root' })
export class UniqueNameValidator implements AsyncValidator {
  public _service = inject(UsersSevice);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this._service
      .isNameTaken((control.value as string).toLowerCase().trim())
      .pipe(
        map((isTaken) => (isTaken ? { uniqueName: true } : null)),
        finalize(() => control.markAsDirty()),
        catchError(() => of(null))
      );
  }
}
