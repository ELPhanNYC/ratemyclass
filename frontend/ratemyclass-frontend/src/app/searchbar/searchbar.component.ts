import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  searchForm: FormGroup;
  filteredCourses: string[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });

    this.setupSearchSubscription();
  }

  getCode() {
    return this.searchForm.get("searchQuery")?.value || "";
  }

  setupSearchSubscription(): void {
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query.trim()) {
            this.filteredCourses = [];
            return of([]);
          }

          return this.apiService.getCourses(query).pipe(
            catchError((error) => {
              return of([]);
            })
          );
        })
      )
      .subscribe((courses: string[]) => {
        this.filteredCourses = courses;
      });
  }

  selectCourse(course: string): void {
    this.searchForm.patchValue({ searchQuery: course });
    this.filteredCourses = [];
  }

  navTo(route: string): void {
    this.router.navigate([route]);
    this.searchForm.reset();
    this.filteredCourses = [];
  }
}
