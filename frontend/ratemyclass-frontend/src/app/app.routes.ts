import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path:"", component: IndexComponent},
    {path:"register", component: RegisterComponent},
    {path:"login", component: LoginComponent},
];
