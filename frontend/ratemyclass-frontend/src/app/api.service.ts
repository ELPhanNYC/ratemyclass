import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Login } from "./login";
import { supervisor } from "./storage.service";

@Injectable({
  providedIn: "root",
})

export class ApiService {
  constructor(private http: HttpClient) {}

  url: string = "https://localhost:8080/";

  sendRegister(data: { username: string; email: string; password: string }) {
    return this.http.post(this.url + "api/register", data);
  }

  sendLogin(data: { email: string; password: string }) {
    return this.http.post<Login>(
      this.url + "api/login",
      data,
    );
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