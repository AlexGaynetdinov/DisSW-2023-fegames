import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit{
  player1? : String
  player2? : String
  ficha1 : number = 1
  ficha2 : number = 2
  public tablero : number[][] = [
    [0, 1, 1, 1, 1, 1, 1],
    [2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0],
  ]
  
  public ws? : WebSocket
  gamesService: GamesService = new GamesService(this.http, this.router);

  constructor(private http:HttpClient, private router : Router) {  }
  
  ngOnInit(): void {
    this.tablero = this.gamesService?.requestGame()
  }

  mover(columna : number) {
    let m = {
      type : "MOVEMENT",
      column : columna,
      match : sessionStorage.getItem("idMatch"),
      player : sessionStorage.getItem("tokenIsmael"),
    }

    this.gamesService.send(JSON.stringify(m))
  }
  test(any : number) {
    this.mover(any)
  }
}