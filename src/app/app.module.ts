import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PostComponent } from './components/post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ScoreComponent } from './components/score/score.component';
import { environment } from '../environments/environment';
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'https://b82e9042775f4941876654a4fb81d785@sentry.io/1830815'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    constructor() {}
    handleError(error) {
        const eventId = Sentry.captureException(error.originalError || error);
        Sentry.showReportDialog({ eventId });
    }
}

@NgModule({
    declarations: [AppComponent, PostComponent, ScoreComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule
    ],
    providers: environment.production ?
      [{ provide: ErrorHandler, useClass: SentryErrorHandler }] : 
      [],
    bootstrap: [AppComponent]
})
export class AppModule {}
