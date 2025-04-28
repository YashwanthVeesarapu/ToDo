// todo-list.component.ts
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
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent,
    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
    FooterComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [
    trigger('tabSlide', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '0.5s ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('todosFade', [
      state('open', style({ width: '55vw', opacity: 1 })),
      state('close', style({ width: '75vw', opacity: 1 })),
      transition('open <=> close', animate('0.5s ease')),
    ]),
    trigger('modalSlide', [
      state('show', style({ transform: 'translateX(0)', opacity: 1 })),
      state('hide', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('show <=> hide', animate('0.5s ease')),
    ]),
  ],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading: boolean = false;
  filteredTodos: Todo[] = [];
  completedTodos: Todo[] = [];
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
  timezone: string = '';

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
          this.router.navigate(['/login']);
        } else {
          alert('Something went wrong.');
          this.authService.logout();
        }
        this.loading = false;
      },
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log('User timezone:', user.timezone);
        this.timezone = user.timezone || 'America/New_York';
      }
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
    if (this.filteredTodos.length === 0) return false;
    this.completedTodos = this.filteredTodos.filter((todo) => todo.completed);
    this.completedTodos = this.completedTodos.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return this.completedTodos.length > 0;
  }

  getTasksForTab(tab: string): number {
    return this.todos.filter((todo) => {
      switch (tab) {
        case 'day':
          return this.isDay(todo) && !todo.completed;
        case 'important':
          return this.isImportant(todo) && !todo.completed;
        case 'planned':
          return this.isPlanned(todo) && !todo.completed;
        case 'tasks':
          return !todo.completed;
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
        (todoDate < currentDate && !todo.completed) ||
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
    if (this.clickData.id) {
      this.clickData = this.todos.find((t) => t.id === this.clickData.id) || {
        id: '',
        title: '',
        date: '',
        repeat: '',
        time: '',
        completed: false,
        important: false,
      };
    }
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
        this.filteredTodos = this.todos;
        break;
      default:
        this.filteredTodos = [];
    }
  }

  closeModal() {
    this.openModal = false;
  }

  repeatChange(e: any) {
    this.clickData.repeat = e.target.value;
    this.todoService.editTodo(this.clickData, this.timezone).subscribe(
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
      (error) => alert(error.error)
    );
  }

  addTask(e: KeyboardEvent, title: HTMLInputElement) {
    if (e.key !== 'Enter' || title.value.trim() === '') return;
    this.todoService.addTask(title.value).subscribe((todo) => {
      this.todos.push(todo);
      this.filterTodosByTab();
      title.value = '';
    });
  }

  completeTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.editTodo(todo, this.timezone).subscribe((d) => {
      this.todos = this.todos.map((t) => (t.id === d.id ? d : t));
      this.filterTodosByTab();
    });
  }

  starTodo(todo: Todo) {
    todo.important = !todo.important;
    this.todoService.editTodo(todo, this.timezone).subscribe(
      () => {
        this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
        this.filterTodosByTab();
      },
      (error) => alert(error.error)
    );
  }
}
