import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private ws? : WebSocket

  constructor(private httpClient : HttpClient) { }

  requestGame() {
    // el <any> nos sirve para que se procese como json y no de error respuesta.id no existe
    this.httpClient.get<any>("http://localhost/games/requestGame?juego=nm&player=" + sessionStorage.getItem("player"))
    .subscribe(
      respuesta => {
        sessionStorage.setItem("idMatch", respuesta.id)
        console.log(respuesta)
        this.prepareWebSocket()
      },
      error => {
        console.log(error)
      }
      
    )
  }

  prepareWebSocket() {
    //la url de websocket es con ws, si fuese https sería wss
    this.ws = new WebSocket("ws://localhost/wsGames")

    this.ws.onopen = function() {
      console.log("WS creado")
    }

    this.ws.onmessage = function(event) {
      console.log("Mensaje recibido: " + JSON.stringify(event.data))
    }
    
    this.ws.onerror = function() {
      console.log("Error en WS: " + JSON.stringify(event))
    }
  }
}
