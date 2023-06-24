import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(private client: HttpClient) { }

  prepay(matches: Number) : Observable<Object> {
    return this.client.get("http://localhost/payments/prepay?amount=" + matches, {
      observe : "response",
      responseType : "text",
      headers : {
        tokenIsmael : ["" + sessionStorage.getItem("tokenIsmael")]
      }
    })
  }

  confirm() : Observable<any> {
    return this.client.get<any>("http://localhost/payments/confirm", {
      observe : "response",
      headers : {
        tokenIsmael : ["" + sessionStorage.getItem("tokenIsmael")],
        player : ["" + sessionStorage.getItem("player")]
      }
    })
  }
}
