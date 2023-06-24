import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient : HttpClient) { }

  register(info : any) {
    this.httpClient.post<any>("http://localhost/users/register", info)
        .subscribe(respuesta => {
            alert(respuesta)
            console.log(respuesta)
        })
  }
  login(info : any) : Observable<any> {
    return this.httpClient.put("http://localhost/users/login", info)
  }
}