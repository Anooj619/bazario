import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err: any) => console.error(err));
// main.ts
//import { bootstrapApplication } from '@angular/platform-browser';
//import { provideAnimations } from '@angular/platform-browser/animations';
//import { provideHttpClient } from '@angular/common/http';
//import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { importProvidersFrom } from '@angular/core';

//import { appConfig } from './app/app.config';
//import { App } from './app/app';

//bootstrapApplication(App, {
//  ...appConfig,
//  providers: [
//    ...(appConfig.providers || []),
//    provideAnimations(), // needed for MatSnackBar
//    provideHttpClient(),
//    importProvidersFrom(MatSnackBarModule) // register snackbar
//  ],
//}).catch((err: any) => console.error(err));


