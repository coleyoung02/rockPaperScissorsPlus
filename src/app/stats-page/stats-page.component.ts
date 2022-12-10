import { Component, OnInit, ViewChild } from '@angular/core';
import { PredictionEvent } from '../prediction-event';
import { StatsService } from '../services/stats.service';
import { HandtrackerComponent } from '../handtracker/handtracker.component';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.css']
})
export class StatsPageComponent {
  //string has value nothing here because it is a placeholder but need to be different from the empty string
  lastGesture:string = "nothingHere";
  gesture:string = "";
  @ViewChild('handtracker' /* #name or Type*/, {static: false}) child: HandtrackerComponent;

  activeLeft:boolean = true;
  activeRight:boolean = false;

  gamesPlayed:number = 0;
  gamesWon:number = 0;
  gamesTied:number = 0;
  gamesLost:number = 0;
  timesRockUsed:number = 0;
  timesScissorsUsed:number = 0;
  timesPaperUsed:number = 0;
  timesWaterUsed:number = 0;
  timesCannonUsed:number = 0;
  winPct:string = "";
  tiePct:string = "";
  lossPct:string = "";
  chart1:any = 0;
  chart2:any = 0;

  constructor(private router:Router, private statsService:StatsService) {
    this.gamesPlayed = statsService.gamesPlayed;
    this.timesRockUsed = statsService.timesRockUsed;
    this.timesScissorsUsed = statsService.timesScissorsUsed;
    this.timesPaperUsed = statsService.timesPaperUsed;
    this.timesWaterUsed = statsService.timesWaterUsed;
    this.timesCannonUsed = statsService.timesCannonUsed;
    this.winPct = statsService.winPercentString;
    this.tiePct = statsService.tiePercentString;
    this.lossPct = statsService.lossPercentString;

    this.gamesWon = statsService.gamesWon;
    this.gamesTied = statsService.gamesTied;
    this.gamesLost = statsService.gamesLost;
  }
  
  ngOnInit(): void {
    if (this.chart1 !== 0) {
      this.chart1.destroy();
    }
    if (this.chart2 !== 0) {
      this.chart1.destroy();
    }
    this.assignCharts();
  }

  ngAfterViewInit() {
    this.child.startDetection();
  }


  changeElementClass(element: HTMLElement, fromClass: string, toClass: string){
    element.classList.remove(fromClass);
    element.classList.add(toClass);
  }
prediction(event: PredictionEvent){
    this.gesture = event.getPrediction();
    if (this.gesture != this.lastGesture) {
      if (this.gesture == "Pointing Left") {
        this.goLeft();
      }
      else if (this.gesture == "Pointing Right") {
        this.goRight();
      }
      else if (this.gesture == "One Open, One Closed") {
        this.clickGesture();
      }
      this.lastGesture = this.gesture;
    }
  }

  //navigation methods are called on any change by predicition which gets called on any update
  goLeft(): void {
    //called on pointing left
    this.setActive('left', 'right');
    this.activeLeft = true;
    this.activeRight = false;
  }

  goRight(): void {
    //called on pointing right
    this.setActive('right', 'left');
    this.activeLeft = false;
    this.activeRight = true;    
  }

  clickGesture(): void {
    //called on one open, one closed
    if (this.activeLeft === true) {
      this.child.stopDetection();
      this.router.navigateByUrl('/');
    }
    else if (this.activeRight === true) {
      this.child.stopDetection();
      this.router.navigateByUrl('/game');
    }
  }

  private setActive(active:string, inactive:string): void {
    let element = document.getElementById(inactive) as HTMLElement;
    this.changeElementClass(element,'btn-primary','btn-secondary');
    element = document.getElementById(active) as HTMLElement;
    this.changeElementClass(element,'btn-secondary','btn-primary');
  }

  public assignCharts() {
    this.chart1 = new Chart("MyChart1", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ["Wins", "Ties", "Losses"], 
	       datasets: [
          {
            label: "Performance",
            data: [this.gamesWon, this.gamesTied, this.gamesLost],
            backgroundColor: [
              'rgb(20, 200, 20)',
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)'
            ]
          }
        ]
      },
      options: {
        aspectRatio:1
      }
      
    });
    this.chart2 = new Chart("MyChart2", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ["Rock", "Paper", "Scissors", "Water", "Cannon"], 
	       datasets: [
          {
            label: "Performance",
            data: [this.timesRockUsed, this.timesPaperUsed, this.timesScissorsUsed, this.timesWaterUsed, this.timesCannonUsed],
            backgroundColor: [
              'rgb(90, 90, 90)',
              'rgb(230, 230, 230)',
              'rgb(255, 60, 60)',
              'rgb(50, 50, 255)',
              'rgb(10, 10, 10)'
            ]
          }
        ]
      },
      options: {
        aspectRatio:1
      }
      
    });
  }

}
