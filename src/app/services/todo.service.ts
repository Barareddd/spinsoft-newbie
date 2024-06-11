import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

  constructor(private http: HttpClient) {}

  getTodo(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.apiUrl, { observe: "response" });
  }
}
