import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit{
  player1? : String
  player2? : String
  gamesService: GamesService = new GamesService(this.http);

  constructor(private http:HttpClient) {  }

  ngOnInit(): void { 
    this.gamesService.requestGame()
   }
}