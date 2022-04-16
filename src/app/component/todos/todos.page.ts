import { Component, OnInit, ViewChild } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { BUTTON_STATE } from '../../types/btn-state';
import { TODO } from '../../types/todo';
import { TodoButtonComponent } from '../todo-button/todo-button.component';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
})
export class TodosPage implements OnInit {

  // the todos to display
  todos: TODO[];

  @ViewChild(TodoButtonComponent,{static:true})
  private TodoButton : TodoButtonComponent;

  constructor(private todoService: TodosService) {}

  ngOnInit(){}

  /**
   * called when the button state changes
   * @param state 
   */
  onStateChange(state: BUTTON_STATE) {

    // if the emitted state is looading, load the todos from the service
    if( state == BUTTON_STATE.LOADING ) {

      // clear the list of todos in UI
      this.todos = [];

      // fetch the todos
      this.todoService.getTodos().subscribe(
        (todos) => {
          this.todos = todos;

          this.setButtonState(BUTTON_STATE.LOADED_AND_DELAYING);
        },
        () => {
          this.setButtonState(BUTTON_STATE.ERROR);
        }
      );
    }
  }

  private setButtonState( state:BUTTON_STATE ){
    this.TodoButton.state = state;
  }
}
