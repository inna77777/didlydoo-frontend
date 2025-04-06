// src/app/app.component.ts
import { Component } from '@angular/core';
import { EventComponent } from './components/event/event.component';

@Component({
  selector: 'app-root',
  template: `<app-event></app-event>`,
  standalone: true,
  imports: [EventComponent],
})
export class AppComponent {}
