import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import * as authAction from '../actions/auth.action';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<authAction.Login>(authAction.AuthActionTypes.Login),
      mergeMap((action: authAction.Login) =>
        this.authService.login(action.payload).pipe(
          map((data: any) => new authAction.LoginSuccess(data)),
          catchError((err) => of(new authAction.LoginFail(err)))
        )
      )
    );
  });

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<authAction.Logout>(authAction.AuthActionTypes.Logout),
        tap((action) => {
          localStorage.removeItem(Constants.TOKEN);
          window.location.href = '/login';
        })
      ),
    { dispatch: false }
  );
}
