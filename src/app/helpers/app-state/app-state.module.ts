import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './reducers/auth.reducer';



@NgModule({
  declarations: [],
  imports: [
    EffectsModule.forRoot([AuthEffects]),

    // Signature matches AppState interface
    // StoreModule.forRoot({
    //   auth: authReducer,
    // }),
    
  ]
})
export class AppStateModule { }
