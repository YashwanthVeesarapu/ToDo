import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AuthGuard } from './AuthGaurd';
import { AboutComponent } from './components/about/about.component';
import { DownloadComponent } from './components/download/download.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TermsComponent } from './components/terms/terms.component';

export const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'download',
    component: DownloadComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
];
