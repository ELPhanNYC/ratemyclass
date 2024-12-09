import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SimpleHeaderComponent } from "../simple-header/simple-header.component";
import { ApiService } from '../api.service';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [SimpleHeaderComponent, CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent {

  courseForm: FormGroup;
  status: string = "";

  knownPrefixes: string[] = ["AAS", "ASL", "AMS", "APY", "ARI", "ARC", "ART", "AHI", "AS", "BCH", "BIO", "BE", "BMI", "BMS", "STA", "CE", "CHE", "CHI", "CIE", "CL", "COM", "CDS", "CHB", "COL", "CDA", "CSE", "CPM", "CEP", "DAC", "ECO", "ELP", "EE", "EAS", "ENG", "ELI", "EVS", "END", "ES", "FR", "MGG", "GEO", "GLY", "GER", "GGS", "GR", "GRE", "HEB", "HIN", "HIS", "HON", "IDS", "IE", "ITA", "JPN", "JDS", "KOR", "LAT", "LLS", "LAW", "LAI", "ULC", "LIS", "LIN", "MGA", "MGT", "MGE", "MGF", "MGI", "MGM", "MGO", "MGQ", "MGS", "MDI", "MTH", "MAE", "DMS", "MT", "MCH", "MIC", "MLS", "MUS", "MTR", "NRS", "NMD", "NTR", "OT", "MGB", "PAS", "PHC", "PMY", "PHM", "PHI", "PHY", "PGY", "POL", "PS", "PSC", "PSY", "PUB", "REC", "NBC", "RLL", "RUS", "SSC", "SW", "SOC", "SPA", "TH", "NBS", "UGC", "UE", "NSG"];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.courseForm = this.fb.group({
      courseCode: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Z]{2,3}[0-9]{3}'), // Adjusted to match 2 or 3 character prefixes
          this.validatePrefix.bind(this), // Custom validator
        ],
      ],
      courseTitle: ['', [Validators.required]],
    });
  }

  loginState: any[] = this.apiService.checkLogInStatus();

  capitalizeTitle() {
    const courseTitleControl = this.courseForm.get('courseTitle');
    if (courseTitleControl) {
      const title = courseTitleControl.value;
      if (title) {
        courseTitleControl.setValue(
          title
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        );
      }
    }
  }

  // Custom validator to check for valid prefix
  validatePrefix(control: any) {
    if (control.value) {
      const match = control.value.match(/^([A-Z]{2,3})/); // Extract prefix (2 or 3 characters)
      const prefix = match ? match[1] : null;
      if (!prefix || !this.knownPrefixes.includes(prefix)) {
        return { invalidPrefix: true }; // Return error if prefix is invalid
      }
    }
    return null; // Valid
  }

  getCode() {
    return this.courseForm.get("courseCode")?.value || '';
  }

  getTitle() {
    return this.courseForm.get("courseTitle")?.value || '';
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const payload = {
        courseCode: this.getCode(),
        courseTitle: this.getTitle()
      };

      this.apiService.sendClass(payload)
      .subscribe(((response:any) => {
        console.log(response)
        this.router.navigate(['']);
      }), error => {
        if (error.status === 400) {
          this.status = "That class already exists!";
        } else {
          this.status = "An unexpected error occurred. Please try again.";
        }
      });
    }
  }
}
