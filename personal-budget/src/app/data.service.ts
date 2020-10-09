import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const url = 'http://localhost:3000/budget';

@Injectable({
  providedIn: 'root'
})
export class DataService {


constructor(private http: HttpClient){
}

  getBudget(): Observable<any>{
    return this.http.get(url);
  }
}







