import {ApplicationConfig, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideState, provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {searchFeatureKey, searchReducer} from "./store/search.feature";
import * as searchEffects from "./store/search.effects";
import {MatSnackBar} from "@angular/material/snack-bar";

export const appConfig: ApplicationConfig = {
  providers: [
    MatSnackBar,
    provideRouter(routes),
    provideAnimations(),
    provideStore(),
    provideState(searchFeatureKey, searchReducer),
    provideEffects(searchEffects),
    provideStoreDevtools({
      maxAge: 30,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: true,
      traceLimit: 80,
    }),
  ]
};
