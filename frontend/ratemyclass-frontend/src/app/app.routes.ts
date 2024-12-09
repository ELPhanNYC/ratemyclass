import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddClassComponent } from './add-class/add-class.component';
import { ClassComponent } from './class/class.component';
import { AddRatingComponent } from './add-rating/add-rating.component';

export const routes: Routes = [
    {path:"", component: IndexComponent},
    {path:"register", component: RegisterComponent},
    {path:"login", component: LoginComponent},
    {path:"addClass", component: AddClassComponent},
    {path:"class/:slug", component: ClassComponent},
    {path:"addRating/:slug", component: AddRatingComponent}
];
