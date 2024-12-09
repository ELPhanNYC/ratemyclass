import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleHeaderComponent } from "../simple-header/simple-header.component";
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { Course } from '../course';
import { CommonModule } from '@angular/common';
import { Rating } from '../rating';

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
  ratings: Rating[] = [];
  averageRating: number = 0;
  averageDifficulty: number = 0;
  numberRatings: number = 0;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseCode = params['slug'];
      this.getCourseTitle();
    });
    this.getCourseRatings();
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

  getCourseRatings():void {
    this.apiService.getRatingsForCourse(this.courseCode)
    .subscribe((response: Rating[]) => {
        this.ratings = response;
        if(this.ratings.length > 0){
          this.computeStatistics();
        }
      }, error =>{
        console.log(error);
    });
  }

  computeStatistics(): void {
    this.numberRatings = this.ratings.length;
    let accRating = 0;
    let accDiff = 0;
    for(let rating of this.ratings){
      accRating += rating.rating;
      accDiff += rating.difficulty;
    }
    this.averageRating = accRating / this.numberRatings;
    this.averageDifficulty = accDiff / this.numberRatings;

  }

  navTo(route: string): void {
    this.router.navigate([route])
  }

}