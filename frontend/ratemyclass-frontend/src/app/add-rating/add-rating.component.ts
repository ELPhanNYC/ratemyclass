import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { SimpleHeaderComponent } from "../simple-header/simple-header.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-rating',
  standalone: true,
  imports: [SimpleHeaderComponent, ReactiveFormsModule, HttpClientModule, RouterModule, CommonModule],
  providers: [ApiService],
  templateUrl: './add-rating.component.html',
  styleUrl: './add-rating.component.scss'
})
export class AddRatingComponent {

  courseCode:string = "";
  ratingForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.ratingForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      difficulty: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      professor: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseCode = params['slug'];
    });
  }

  submitRating(): void {
    if (this.ratingForm.valid) {
      const ratingData = this.ratingForm.value;
      ratingData.code = this.courseCode;
      ratingData.createdBy = this.apiService.checkLogInStatus()[0];

      this.apiService.sendRating(ratingData).subscribe(
        (response) => {
          console.log('Rating submitted.')
          this.router.navigate(['class/'+this.courseCode])
        },
        (error) => {
          console.log('Error submitting rating:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
