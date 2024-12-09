import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Login } from "./login";
import { supervisor } from "./storage.service";
import { Course } from "./course";
import { Rating } from "./rating";

@Injectable({
  providedIn: "root",
})

export class ApiService {
  constructor(private http: HttpClient) {}

  url: string = "http://localhost:8080/";

  sendRegister(data: { username: string; email: string; password: string }) {
    return this.http.post(`${this.url}api/register`, data);
  }

  sendLogin(data: { email: string; password: string }) {
    return this.http.post<Login>(`${this.url}api/login`, data);
  }

  sendClass(data: {courseCode: string; courseTitle: string}) {
    return this.http.post(`${this.url}api/addClass`, data);
  }

  getCourses(query: string) {
    return this.http.get<string[]>(`${this.url}api/getCourses`, {
      params: { query },
    });
  }

  getCourseTitle(courseCode: string) {
    return this.http.get<Course>(`${this.url}api/getTitle/${courseCode}`);
  }
  
  getRatingsForCourse(courseCode: string): Observable<any[]> {
    return this.http.get<Rating[]>(`${this.url}api/getRatings/${courseCode}`);
  }
  
  sendRating(data: { code: string; rating: number; difficulty: number; professor: string; comments: string; createdBy: string }) {
    return this.http.post(`${this.url}api/rateCourse`, data);
  }

  logout() {
    supervisor.removeItem("username");
    supervisor.removeItem("token");
  }

  checkLogInStatus() {
    const user = supervisor.getItem('username');
    const token = supervisor.getItem('token');
    if(user && token) {
      return [user, token]
    }
    return []
  }
}