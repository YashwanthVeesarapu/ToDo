import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/Todo';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '../todo/todo.component';
import { TodoService } from '../../services/todo/todo.service';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent,
    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading: boolean = false;
  filteredTodos: Todo[] = [];
  clickData: Todo = {
    id: '',
    title: '',
    date: '',
    repeat: '',
    time: '',
    completed: false,
    important: false,
  };
  openModal: boolean = false;
  selectedTab = 'day';
  title: string = '';

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.filterTodosByTab();
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          alert('Please login to continue.');
          this.authService.logout();
          // navigate to login page
          this.router.navigate(['/login']);
        } else alert('Something went wrong.');
        this.loading = false;
      },
    });
  }

  setSelection(tab: string) {
    this.selectedTab = tab;
    this.filterTodosByTab();
  }

  handleClick(todo: Todo) {
    if (this.clickData && this.clickData.id === todo.id) {
      this.openModal = !this.openModal;
    } else {
      this.clickData = todo;
      this.openModal = true;
      this.clickData = todo;
    }
  }

  dateChange(e: any) {
    this.clickData.date = e.target.value;
    this.todoService.editTodoDate(this.clickData).subscribe({
      next: (todo) => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      error: (error) => alert(error.error),
    });
  }

  timeChange(e: any) {
    this.clickData.time = e.target.value;

    this.todoService.editTodoDate(this.clickData).subscribe({
      next: (todo) => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      error: (error) => alert(error.error),
    });
  }

  hasCompletedTodos(): boolean {
    return this.filteredTodos.some((todo) => todo.completed);
  }

  getTasksForTab(tab: string): number {
    return this.todos.filter((todo) => {
      switch (tab) {
        case 'day':
          return this.isDay(todo) && !todo.completed;
        case 'important':
          // Logic to filter tasks for "Important"
          // For example, you might want to filter tasks marked as important
          return this.isImportant(todo) /* your condition for Important */;
        case 'planned':
          // Logic to filter tasks for "Planned"
          // For example, you might want to filter tasks with a specific planned date
          return this.isPlanned(todo) /* your condition for Planned */;
        case 'tasks':
          // Logic to filter all tasks
          return todo.completed === false;
        default:
          return false;
      }
    }).length;
  }

  isDay(todo: Todo) {
    if (todo.date) {
      const currentDate = new Date();
      const todoDate = new Date(todo.date);

      return (
        (todoDate < currentDate && todo.completed === false) ||
        (currentDate.getDate() === todoDate.getDate() &&
          currentDate.getMonth() === todoDate.getMonth() &&
          currentDate.getFullYear() === todoDate.getFullYear())
      );
    }
    return false;
  }

  isImportant(todo: Todo) {
    return todo.important;
  }

  isPlanned(todo: Todo) {
    return (todo.date || todo.repeat) && !todo.completed;
  }

  filterTodosByTab() {
    switch (this.selectedTab) {
      case 'day':
        this.filteredTodos = this.todos.filter((todo) => this.isDay(todo));
        break;
      case 'important':
        this.filteredTodos = this.todos.filter((todo) =>
          this.isImportant(todo)
        );
        break;
      case 'planned':
        this.filteredTodos = this.todos.filter((todo) => this.isPlanned(todo));
        break;
      case 'tasks':
        this.filteredTodos = this.todos; // Display all tasks for "Tasks" tab
        break;
      default:
        this.filteredTodos = [];
        break;
    }
  }

  //Modal Functions
  closeModal() {
    this.openModal = false;
  }

  //Server

  repeatChange(e: any) {
    this.clickData.repeat = e.target.value;
    this.todoService.editTodo(this.clickData).subscribe(
      (todo) => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      (error) => alert(error.error)
    );
  }

  remindChange(e: any) {
    this.clickData.remind = e.target.value;
    this.todoService.editTodoDate(this.clickData).subscribe(
      (todo) => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      (error) => alert(error.error)
    );
  }
  deleteTodo(todo: Todo) {
    if (!todo.id) return;

    this.todoService.deleteTodo(todo).subscribe(
      () => {
        this.todos = this.todos.filter((t) => t.id !== todo.id);
        this.filterTodosByTab();
        this.openModal = false;
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  addTask(e: KeyboardEvent, title: HTMLInputElement) {
    if (e.key !== 'Enter') return;

    if (title.value.trim() === '') {
      return;
    }

    this.todoService.addTask(title.value).subscribe((todo) => {
      this.todos.push(todo);
      this.filterTodosByTab();
      title.value = '';
    });
  }

  completeTodo(todo: Todo) {
    this.clickData;
    todo.completed = !todo.completed;

    this.todoService.editTodo(todo).subscribe((d) => {
      this.todos = this.todos.map((t) => (t.id === todo.id ? d : t));
      this.filterTodosByTab();
    });
  }

  starTodo(todo: Todo) {
    todo.important = !todo.important;
    this.todoService.editTodo(todo).subscribe(
      () => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      (error) => alert(error.error)
    );
  }
}
