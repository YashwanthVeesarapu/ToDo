// about.component.ts
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('floatIn', [
      transition(':enter', [
        animate(
          '1.5s ease-out',
          keyframes([
            style({
              opacity: 0,
              transform: 'translateY(60px) rotateX(-10deg)',
              offset: 0,
            }),
            style({
              opacity: 0.8,
              transform: 'translateY(-15px) rotateX(5deg)',
              offset: 0.7,
            }),
            style({
              opacity: 1,
              transform: 'translateY(0) rotateX(0)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
    trigger('pulseGlow', [
      state(
        'normal',
        style({
          boxShadow:
            '0 0 20px rgba(0, 123, 255, 0.5), 0 0 40px rgba(0, 123, 255, 0.2)',
        })
      ),
      state(
        'active',
        style({
          boxShadow:
            '0 0 40px rgba(0, 123, 255, 0.9), 0 0 60px rgba(0, 123, 255, 0.5)',
        })
      ),
      transition('normal <=> active', animate('0.6s ease-in-out')),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  cardState: string[] = ['normal', 'normal'];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleGlow(index: number) {
    this.cardState[index] =
      this.cardState[index] === 'normal' ? 'active' : 'normal';
  }

  navigateTo(route: string, event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    this.router.navigate([route]);
  }
}
