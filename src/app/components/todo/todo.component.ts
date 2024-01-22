import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../Todo';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() onCompleteTodo = new EventEmitter<Todo>();
  @Output() onStarTodo = new EventEmitter<Todo>();
  @Output() handleClick = new EventEmitter<Todo>();

  constructor() {}

  ngOnInit(): void {}

  onComplete(todo: Todo): void {
    this.onCompleteTodo.emit(todo);
  }

  onStar(todo: Todo): void {
    this.onStarTodo.emit(todo);
  }

  todoClick(todo: Todo): void {
    this.handleClick.emit(todo);
  }
}
