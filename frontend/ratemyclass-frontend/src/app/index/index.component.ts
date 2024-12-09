import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { AuthComponent } from "../auth/auth.component";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SearchbarComponent, AuthComponent, RouterModule],
  providers: [ApiService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  constructor(private apiService: ApiService, private router: Router){}

  loginState: any[] = this.apiService.checkLogInStatus();

  logout():void {
    this.apiService.logout();
  }

  navTo(route: string): void {
    this.router.navigate([route])
  }

}
