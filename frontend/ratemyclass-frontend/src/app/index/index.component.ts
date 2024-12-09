import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthComponent } from "../auth/auth.component";
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, AuthComponent, SearchbarComponent],
  providers: [ApiService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  constructor(private apiService: ApiService, private router: Router){}

  loginState: any[] = this.apiService.checkLogInStatus();

  logout():void {
    this.apiService.logout();
    this.loginState = [];
  }

  navTo(route: string): void {
    this.router.navigate([route])
  }

}
