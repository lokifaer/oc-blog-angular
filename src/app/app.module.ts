// import { LOCALE_ID, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { HeaderComponent } from './header/header.component';
import { PostsService } from './services/posts.service';
import { Routes, RouterModule } from '@angular/router';

import { TooltipModule } from 'ngx-tooltip';
import { Globals } from './services/globals.service';
import { AboutComponent } from './about/about.component';
import { VotesService } from './services/votes.service';
import { RootGuardService } from './services/root-guard.service';

// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';
// registerLocaleData(localeFr, 'fr-FR');

const appRoutes: Routes = [
  { path: 'posts', canActivate:[RootGuardService], component: PostListComponent },
  { path: 'new', canActivate:[RootGuardService], component: NewPostComponent, },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: '**', redirectTo: 'posts' }
];

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    NewPostComponent,
    PostListComponent,
    HeaderComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TooltipModule
  ],
  // providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  providers: [
    PostsService,
    Globals,
    VotesService,
    RootGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
