import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EventService } from '../../services/event.service';
import { CreateEventComponent } from '../create-event/create-event.component';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { EventAvailabilityComponent } from '../event-availability/event-availability.component';
import { Event, DateAvailability } from '../../models/event.model';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    FontAwesomeModule,
    CreateEventComponent,
    EventModalComponent,
    EventAvailabilityComponent,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  isLoading: boolean = false;
  username: string = '';
  availabilitiesMap: { [eventId: string]: boolean[] } = {};
  faPencil = faPencil;
  faTrash = faTrash;
  showAvailabilities = false;
  selectedAvailabilityEventId: string | null = null;
  events: Event[] = [];
  newEvent: Event = {
    id: '',
    name: '',
    author: '',
    description: '',
    dates: [],
  };
  eventToEdit: Event = {
    id: '',
    name: '',
    author: '',
    description: '',
    dates: [],
  };
  newDates: DateAvailability[] = [];
  isFormVisible = false;
  modalAction: 'edit' | 'delete' = 'edit';
  initialDate: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.isLoading = true;
    this.eventService.fetchEvents().subscribe({
      next: (events) => {
        this.events = events.map((event) => ({
          ...event,
          dates: event.dates.map((date) => ({
            ...date,
            attendees: date.attendees.map((attendee) => ({ ...attendee })),
          })),
        }));

        this.events.forEach((event) => {
          if (!this.availabilitiesMap[event.id]) {
            this.availabilitiesMap[event.id] = event.dates.map(() => false);
          }
        });
      },
      error: (err) => console.error('Error fetching events:', err),
      complete: () => (this.isLoading = false),
    });
  }

  toggleAvailabilities(eventId: string) {
    this.selectedAvailabilityEventId =
      this.selectedAvailabilityEventId === eventId ? null : eventId;
  }

  toggleAvailability(eventId: string, dateIndex: number): void {
    if (!this.availabilitiesMap[eventId]) {
      this.availabilitiesMap[eventId] = [];
    }
    this.availabilitiesMap[eventId][dateIndex] =
      !this.availabilitiesMap[eventId][dateIndex];
  }

  isAvailable(eventId: string, index: number): boolean {
    return this.availabilitiesMap[eventId]?.[index] ?? false;
  }

  editEvent(event: Event) {
    this.eventToEdit = {
      ...event,
      dates: event.dates.map((date) => ({ ...date })),
    };
    this.modalAction = 'edit';
    this.openModal();
  }

  deleteEvent(event: Event) {
    this.eventToEdit = { ...event };
    this.modalAction = 'delete';
    this.openModal();
  }

  confirmDelete() {
    this.eventService.deleteEvent(this.eventToEdit.id).subscribe({
      next: () => {
        this.fetchEvents();
        this.closeModal();
      },
      error: (err) => console.error('Error deleting event:', err),
    });
  }

  openModal() {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'block';
  }

  closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
    this.resetForm();
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
    console.log('Date added:', date);
  }

  onDateRemoved(index: number) {
    console.log('Date removed at index:', index);
  }

  handleEventCreated(newEvent: Event) {
    this.fetchEvents();
    this.resetForm();
  }
  handleEventUpdated(updatedEvent: Event) {
    this.fetchEvents();
  }

  handleEventDeleted(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.fetchEvents();
        this.closeModal();
      },
      error: (err) => console.error('Error deleting event:', err),
    });
  }
}
