import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private ws? : WebSocket

  constructor(private httpClient : HttpClient) { }

  requestGame() {
    this.httpClient.get<any>("http://localhost/users/register" + sessionStorage.getItem("player"))
        .subscribe({
          next : (respuesta : any) => {
            sessionStorage.setItem("idMatch", respuesta.id)
            console.log(respuesta)
            this.prepareWebSocket()
          },
          error : (respuesta : any) => {
            console.log(respuesta)
          }})
  }

  prepareWebSocket() {
    this.ws = new WebSocket("ws://localhost/wsGames")
    this.ws.onopen = function() {
      console.log("ws abierto")
      alert("ws abierto")
    }

    this.ws.onmessage = function(event) {
      console.log("mensaje recibido: " + JSON.stringify(event.data))
    }

    this.ws.onclose = function() {
      console.log("ws cerrado")
    }

    this.ws.onerror = function(event) {
      console.log("error en ws: " + JSON.stringify(event))
    }
  }
}
