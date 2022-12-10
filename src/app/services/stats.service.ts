import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  gamesWon:number = 0;
  gamesTied:number = 0;
  gamesLost:number = 0;
  gamesPlayed:number = 0;
  timesRockUsed:number = 0;
  timesScissorsUsed:number = 0;
  timesPaperUsed:number = 0;
  timesWaterUsed:number = 0;
  timesCannonUsed:number = 0;
  // the map is formatted such that every key maps to the things it beats
  // so rock maps to scissors and water for example
  static winning:Map<string, string[]>= new Map([
    ["Closed Hand",["Hand Pointing","Two Open Hands"]], //rock
    ["Open Hand",["Closed Hand","Two Closed Hands"]], //paper
    ["Hand Pointing",["Open Hand","Two Open Hands"]], //scissors
    ["Two Open Hands",["Open Hand","Two Closed Hands"]], //water
    ["Two Closed Hands",["Closed Hand","Hand Pointing"]] //cannon
  ]);
  constructor() { }


  //return -1 on loss, 0 on tie, 1 on win
  //signs will be passed in as "Open Hand", "Two Open Hands", ...
  public playGame(playerSign:string, computerSign:string): number {
    let status:number;

    //determine winner
    if (playerSign == computerSign) {
      status = 0;
    }
    else {
      if (StatsService.winning.has(playerSign) && StatsService.winning.get(playerSign)?.includes(computerSign)){
        status = 1;
      }
      else status = -1;
    }

    this.incrementMoves(playerSign);
    //increment appropriate stat
    if (status > 0) {
      console.log(1, status);
      this.gamesWon++;
    }
    else if (status == 0) {
      console.log(2, status);
      this.gamesTied++;
    }
    else {
      console.log(3, status);
      this.gamesLost++;
    }
    this.gamesPlayed++;
    return status;
  }

  private incrementMoves(move:string): void {
    if (move == "Closed Hand") {//rock
      this.timesRockUsed++;
    }
    else if (move == "Open Hand") {//paper
      this.timesPaperUsed++;
    }
    else if (move == "Hand Pointing") {//scissors
      this.timesScissorsUsed++;
    }
    else if (move == "Two Open Hands") {//water
      this.timesWaterUsed++;
    }
    else if (move == "Two Closed Hands") {//cannon
      this.timesCannonUsed++;
    }
  }

  get winPercentString(): string {
    return (this.gamesWon * 100 / (this.gamesPlayed)).toFixed(2) + "%";
  }

  get tiePercentString(): string {
    return (this.gamesTied * 100 / (this.gamesPlayed)).toFixed(2) + "%";
  }

  get lossPercentString(): string {
    return (this.gamesLost * 100 / (this.gamesPlayed)).toFixed(2) + "%";
  }
}
