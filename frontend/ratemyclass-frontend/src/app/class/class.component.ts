import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleHeaderComponent } from "../simple-header/simple-header.component";
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { Course } from '../course';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [SimpleHeaderComponent, HttpClientModule, RouterModule, CommonModule],
  providers: [ApiService],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss'
})
export class ClassComponent {

  courseCode: string = '';
  courseTitle: string ='';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseCode = params['slug'];
      this.getCourseTitle();
    });
  }

  loginStatus = this.apiService.checkLogInStatus()

  getCourseTitle(): void {
    this.apiService.getCourseTitle(this.courseCode)
    .subscribe((response: Course) => {
        this.courseTitle = response.courseTitle;
      }, error =>{
        console.log(error);
    });
  }

  // getCourseRatings():void {

  // }

  navTo(route: string): void {
    this.router.navigate([route])
  }

}