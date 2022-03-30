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

  @Output() stateChange = new EventEmitter<BUTTON_STATE>();

  private delaySecs: number = config.todos.delayAfterLoadSecs;
  
  private _state: BUTTON_STATE;

  set state(state){
    this._state = state;
    this.reflectState();
    this.stateChange.emit(state);
  }

  get state(){
    return this._state;
  }

  btnText: string;
  btnDisabled:boolean;

  ngOnInit() {
    this.state = BUTTON_STATE.LOADING;
  }

  onClick(){
    this.state = BUTTON_STATE.LOADING;
  }

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
      
        // ........

      case BUTTON_STATE.LOADED_AND_DELAYING:
        this.btnDisabled = true;
        this.delay().subscribe({
          next:(remainingTime)=>{
            this.btnText = `wait ${ remainingTime } sec${ remainingTime > 1 ?'s':'' } `;
          },
          complete:()=>{
            this.state = BUTTON_STATE.LOADED;
          }
        });
        break;
    }

  }

  private delay() : Observable<number>{

    const delaySecs = this.delaySecs;

    return timer(0,1000).pipe( take(delaySecs),map( v => delaySecs - v ) );
  }
}
