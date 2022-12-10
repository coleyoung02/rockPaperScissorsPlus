import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HandtrackerComponent } from '../handtracker/handtracker.component';
import { PredictionEvent } from '../prediction-event';

@Component({
  selector: 'app-rules-page',
  templateUrl: './rules-page.component.html',
  styleUrls: ['./rules-page.component.css']
})
export class RulesPageComponent {
  //string has value nothing here because it is a placeholder but need to be different from the empty string
  lastGesture:string = "nothingHere";
  gesture:string = "";
  @ViewChild('handtracker' /* #name or Type*/, {static: false}) child: HandtrackerComponent;

  activeLeft:boolean = false;
  activeRight:boolean = false;

  constructor(private router:Router) {}
  
  ngOnInit(): void {
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
}
