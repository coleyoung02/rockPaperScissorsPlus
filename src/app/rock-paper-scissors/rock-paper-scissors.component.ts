import { Component, Input, SimpleChanges } from '@angular/core';
import { clear } from 'console';
import { StatsService } from '../services/stats.service';



function delay(delay: number) {
  return new Promise(r => {
      setTimeout(r, delay);
  })
}

@Component({
  selector: 'app-rock-paper-scissors',
  templateUrl: './rock-paper-scissors.component.html',
  styleUrls: ['./rock-paper-scissors.component.css']
})

export class RockPaperScissorsComponent {
  //sign is whatever input comes in (could be nav input)
  @Input() sign:string;
  //player sign is most recent actual game move sign
  playerSign:string = "";
  computerSign:string;
  activeMoveImg:string = "";
  activeMoveAlt:string = "";
  computerMoveImg:string = "";
  computerMoveAlt:string = "";
  timeLeft:any;
  counter: number;
  result: number;
  wins:number = 0;
  ties: number = 0;
  losses: number = 0


  
  
  static signsList = [
    "Closed Hand",
    "Open Hand",
    "Hand Pointing",
    "Two Open Hands",
    "Two Closed Hands",
  ];
  static iconList = [
    "rock",
    "paper",
    "scissors",
    "water",
    "cannon",
  ];
  


  //this component does not need any navigation as it is a subcomponet of the game page
  constructor(private statsService:StatsService) {}


  //This method starts a timer that will run the provided function after "length" seconds
  startTimer(length:number, callback: () => void) {
    // Declare a local variable to store the timer
    let timer: NodeJS.Timeout; //timer object
    let interval: NodeJS.Timer; //iymterval object to decrement "timeLeft" every second
    let time = length * 1000; //calculate millisecinds
    this.timeLeft = length; // set timeLeft

  
    // Set the timer to trigger the callback after 10 seconds
    timer = setTimeout(() => {
      // Clear the timer to prevent it from triggering again
      clearTimeout(timer);
      clearInterval(interval);
      // Call the callback function
      callback();
    }, time);

    interval = setInterval(() => {
      this.timeLeft--;
    }, 1000)

  
    // Return a function that can be used to reset the timer
    return (reset:boolean) => {
      // Clear the existing timer
      clearTimeout(timer);
      clearInterval(interval);
      if (reset == true){ //if reset is true, we reset the timer and interval. if not, we just stop the timer and interval
        this.counter = length;
        // Set a new timer that will trigger the callback after 10 seconds
        timer = setTimeout(() => {
          // Clear the timer to prevent it from triggering again
          clearTimeout(timer);
          clearInterval(interval);
          // Call the callback function
          callback();
        }, time);
        interval = setInterval(() => {
        this.timeLeft--;
        }, 1000)
      }
    };
  }

  private resetTimer: (reset: boolean) => void;

  // Start the timer when the component is initialized
  ngOnInit() {
    this.activeMoveImg = "../../assets/icons/question-mark.png"
    this.activeMoveAlt = "Unknown"
    this.computerMoveImg = "../../assets/icons/question-mark.png"
    this.computerMoveAlt = "Unknown"

    this.timeLeft = 5;

    this.resetTimer = this.startTimer(5,() => {
      // This code will be called after 10 seconds
      console.log("Timer is done! " + this.sign);
      if (this.sign != "None" && this.sign != '' && this.sign != 'Pointing Left' && this.sign != 'Pointing Right' && this.sign != 'Hand Pinching'){
        this.timeLeft = "DONE";
        this.onTimerEnd();
      }
      
    });
  }

  // Reset the timer when the reset button is clicked
  reset() {
    console.log("TIMER STARTED")
    console.log("CURRENT SIGN: " + this.sign )
    this.resetTimer(true);
  }

  stop(){
    console.log("TIMER STOPPED")
    console.log("CURRENT SIGN: " + this.sign )
    this.timeLeft = "MAKE A MOVE!";
    this.resetTimer(false);
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (this.sign == '' || this.sign == 'None' || this.sign == 'Pointing Left' || this.sign == 'Pointing Right' || this.sign == 'Hand Pinching'){
      this.stop();
    }
    else{
      this.reset();
    }
    
    let myArray = RockPaperScissorsComponent.getImageSrc(this.sign);
    if (myArray[0] != "") {
      this.activeMoveImg = RockPaperScissorsComponent.getImageSrc(this.sign)[0];
      this.activeMoveAlt = RockPaperScissorsComponent.getImageSrc(this.sign)[1];
      this.playerSign = this.sign;
      this.timeLeft = 5;
    }
    else{
      this.activeMoveImg = "../../assets/icons/question-mark.png"
      this.activeMoveAlt = "Unknown"
      this.computerMoveImg = "../../assets/icons/question-mark.png"
      this.computerMoveAlt = "Unknown"
    }
  }



  
  onTimerEnd(): void {

    let activateFlip:number = 1; //If this is 0 the flipping animation won't happen. If it's >0 it will.

    let flipInterval = setInterval(() => {
      this.computerSign = RockPaperScissorsComponent.getRandomSign();
      this.computerMoveImg = RockPaperScissorsComponent.getImageSrc(this.computerSign)[0];
      this.computerMoveAlt = RockPaperScissorsComponent.getImageSrc(this.computerSign)[1];
    }, 100)

    let flipTimer = setTimeout(() => {
      clearInterval(flipInterval);
      clearTimeout(flipTimer);
      this.computerSign = RockPaperScissorsComponent.getRandomSign();
      this.computerMoveImg = RockPaperScissorsComponent.getImageSrc(this.computerSign)[0];
      this.computerMoveAlt = RockPaperScissorsComponent.getImageSrc(this.computerSign)[1];
      this.result = this.statsService.playGame(this.sign, this.computerSign);
      if (this.result == -1){
        this.losses++;
      }
      if (this.result == 0){
        this.ties++;
      }
      if (this.result == 1){
        this.wins++;
      }
    },activateFlip * 1500);

  }



  

  private static getRandomSign():string {
    return RockPaperScissorsComponent.signsList[Math.floor(Math.random() * RockPaperScissorsComponent.signsList.length)];
  }
  
  private static getImageSrc(move:string): string[] {
    let returnArray = ["", ""];
    if (RockPaperScissorsComponent.signsList.indexOf(move) == -1) {
      return returnArray;
    }
    let nombre = RockPaperScissorsComponent.iconList[RockPaperScissorsComponent.signsList.indexOf(move)];
    returnArray[0] = "../../assets/icons/" + nombre + ".png";
    returnArray[1] = nombre;
    return returnArray;
  }
}
