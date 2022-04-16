import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of,timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { config } from '../../data/config';
import { BUTTON_STATE } from '../../types/btn-state';

@Component({
  selector: 'app-todo-button',
  templateUrl: './todo-button.component.html',
  styleUrls: ['./todo-button.component.scss'],
})
export class TodoButtonComponent implements OnInit {

  BUTTON_STATE : typeof BUTTON_STATE = BUTTON_STATE;

  // will be used to emit the state when it changes.
  @Output() stateChange = new EventEmitter<BUTTON_STATE>();

  // The amount of seconds to delay the button when state is set to loaded and delaying
  private delaySecs: number = config.todos.delayAfterLoadSecs;
  
  // the button state
  private _state: BUTTON_STATE;

  @Input()
  set state(state){
    this._state = state;

    // reflect the new state
    this.reflectState();
    this.stateChange.emit(state);
  }

  get state(){
    return this._state;
  }

  // the button label
  btnText: string;

  // used to indicate if the button should be disabled or not
  btnDisabled:boolean;

  ngOnInit() {
    // kickstart the application
    this.state = BUTTON_STATE.LOADING;
  }

  onClick(){
    // trigger a reload
    this.state = BUTTON_STATE.LOADING;
  }

  /**
   * Called to update the button UI based on its current state.
   */
  private reflectState(){

    switch (this.state) {

      case BUTTON_STATE.LOADING:
        this.btnText = 'loading...';
        this.btnDisabled = true;
        break;

      case BUTTON_STATE.LOADED:
        this.btnText = 'reload';
        this.btnDisabled = false;
        break;

      case BUTTON_STATE.ERROR:
        this.btnText = 'Load Error Retry';
        this.btnDisabled = false;
        break;

      case BUTTON_STATE.LOADED_AND_DELAYING:
        this.btnDisabled = true;

        // run the delay logic
        this.delay().subscribe({
          next:(remainingTime)=>{
            // keep updating the button label with the delay seconds remaining
            this.btnText = `wait ${ remainingTime } sec${ remainingTime > 1 ?'s':'' } `;
          },
          complete:()=>{
            // set state to loaded at the end of the delay
            this.state = BUTTON_STATE.LOADED;
          }
        });
        break;
    }
  }

  /** 
   * @returns an observable that completes after an amount of seconds and keeps emitting values every second in decreasing order from that amount of seconds to 0.
   */
  private delay() : Observable<number>{

    const delaySecs = this.delaySecs;

    return timer(0,1000).pipe( take(delaySecs),map( v => delaySecs - v ) );
  }
}
