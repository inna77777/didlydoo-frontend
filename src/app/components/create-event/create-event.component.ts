import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateInputComponent } from '../date-input/date-input.component';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { EventService } from '../../services/event.service';
import { NgZone } from '@angular/core';
import { Event, DateAvailability } from '../../models/event.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  standalone: true,
  imports: [CommonModule, DateInputComponent, FormsModule],
})
export class CreateEventComponent {
  @Output() eventCreated = new EventEmitter<Event>();

  newEvent: Event = {
    id: '',
    name: '',
    author: '',
    description: '',
    dates: [],
  };
  newDates: DateAvailability[] = [];
  isFormVisible: boolean = false;
  initialDate: string = '';
  events: Event[] = [];
  availabilitiesMap: { [key: string]: boolean[] } = {};

  constructor(
    private eventService: EventService,
    private zone: NgZone
  ) {}

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  submitEvent() {
    const eventToSubmit = { ...this.newEvent };
    eventToSubmit.dates = [...this.newDates];

    if (this.initialDate) {
      eventToSubmit.dates.unshift({
        date: this.initialDate,
        attendees: [],
      });
    }

    if (
      !eventToSubmit.name ||
      !eventToSubmit.author ||
      !eventToSubmit.description ||
      eventToSubmit.dates.length === 0
    ) {
      console.error('Missing required fields:', eventToSubmit);
      return;
    }

    eventToSubmit.dates = eventToSubmit.dates.map((date: DateAvailability) => ({
      date: date.date,
      attendees: date.attendees || [],
    }));

    if (eventToSubmit.name && eventToSubmit.dates.length) {
      const eventToAdd = {
        name: eventToSubmit.name,
        author: eventToSubmit.author,
        description: eventToSubmit.description,
        dates: [...eventToSubmit.dates]
          .map((dateInput) => {
            if (!dateInput.date) {
              console.error('Date is missing or invalid.');
              return null;
            }
            return dateInput.date;
          })
          .filter(Boolean),
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      this.eventService.createEvent(eventToAdd, { headers }).subscribe({
        next: () => {
          this.eventCreated.emit(eventToSubmit);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating event:', err);
          alert('Failed to create event. Please try again.');
        },
      });
    } else {
      console.error('Please complete the required fields.');
      alert('Please complete the required fields.');
    }
  }

  resetForm() {
    this.newEvent = {
      id: '',
      name: '',
      author: '',
      description: '',
      dates: [],
    };
    this.newDates = [];
    this.initialDate = '';
  }

  onDateAdded(date: string) {
    this.newDates.push({ date, attendees: [] });
  }

  onDateRemoved(index: number) {
    if (index >= 0 && index < this.newDates.length) {
      this.newDates.splice(index, 1);
    }
  }
}
