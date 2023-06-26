import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GamesService{
  static tablero : number[][] = [
    [1, 2, 1, 2, 1, 2, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 2, 0],
  ]
  public ws? : WebSocket

  constructor(private httpClient : HttpClient, private router : Router) {  }

  requestGame() : number[][]{
    this.httpClient.get<any>("http://localhost/games/requestGame?player=" + sessionStorage.getItem("tokenIsmael"))
        .subscribe({
          next : (respuesta : any) => {
            sessionStorage.setItem("idMatch", respuesta.id)
            console.log(respuesta) 
            GamesService.tablero[0] = respuesta.board[0]
            GamesService.tablero[1] = respuesta.board[1]
            GamesService.tablero[2] = respuesta.board[2]
            GamesService.tablero[3] = respuesta.board[3]
            GamesService.tablero[4] = respuesta.board[4]
            GamesService.tablero[5] = respuesta.board[5]
            this.prepareWebSocket()
          },
            error : (respuesta : any) => {
            console.log(respuesta)
          }
        })
    return GamesService.tablero
  }

  prepareWebSocket() {
    this.ws = new WebSocket("ws://localhost:80/wsGames")
    this.ws.onopen = function() {
      console.log("ws abierto")
    }

    this.ws.onmessage = (event) => {
      console.log(JSON.parse(event.data).board[0])
      GamesService.tablero[0] = JSON.parse(event.data).board[0]
      GamesService.tablero[1] = JSON.parse(event.data).board[1]
      GamesService.tablero[2] = JSON.parse(event.data).board[2]
      GamesService.tablero[3] = JSON.parse(event.data).board[3]
      GamesService.tablero[4] = JSON.parse(event.data).board[4]
      GamesService.tablero[5] = JSON.parse(event.data).board[5]
    }

    this.ws.onclose = (event) => {
      console.log(event)
      window.location.href = 'http://localhost:4200/login'
    }

    this.ws.onerror = function(error) {
      console.log(error);
    }
  }

  send(info : any) {
    this.ws?.send(info)
  }
}
