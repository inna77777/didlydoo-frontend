import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateInputComponent } from '../date-input/date-input.component';
import { EventService } from '../../services/event.service';
import { HttpHeaders } from '@angular/common/http';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, DateInputComponent],
})
export class EventModalComponent {
  private _eventToEdit?: Event;

  @Input() modalAction: 'edit' | 'delete' = 'edit';

  @Input()
  set eventToEdit(value: Event | undefined) {
    this._eventToEdit = value;
  }

  get eventToEdit(): Event | undefined {
    return this._eventToEdit;
  }

  constructor(private eventService: EventService) {}

  @Input() newDates: any[] = [];
  @Input() initialDate: string = '';
  @Output() eventUpdated = new EventEmitter<Event>();
  @Output() eventDeleted = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();

  updateEventDetails() {
    if (!this.eventToEdit) {
      alert('Event is missing.');
      return;
    }

    if (
      !this.eventToEdit?.name ||
      !this.eventToEdit.author ||
      !this.eventToEdit.description
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedEvent = {
      name: this.eventToEdit.name,
      author: this.eventToEdit.author,
      description: this.eventToEdit.description,
    };

    const existingDates = this.eventToEdit.dates.map((date) => date.date);
    const newAddedDates = this.newDates.filter(
      (newDate) => newDate.date && !existingDates.includes(newDate.date)
    );
    const uniqueDates = Array.from(
      new Set(newAddedDates.map((date) => date.date))
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const eventId = this.eventToEdit.id;

    this.eventService
      .updateEvent(this.eventToEdit.id, updatedEvent, { headers })
      .subscribe({
        next: () => {
          if (uniqueDates.length > 0) {
            this.eventService
              .addDatesToEvent(eventId, uniqueDates, { headers })
              .subscribe({
                next: () => {
                  this.eventUpdated.emit(this.eventToEdit);
                  this.modalClosed.emit();
                },
                error: (err) => {
                  console.error('Error adding new dates:', err);
                  alert('Failed to add new dates. Please try again.');
                },
              });
          } else {
            this.eventUpdated.emit(this.eventToEdit);
            this.modalClosed.emit();
          }
        },
        error: (err) => {
          console.error('Error updating event:', err);
          alert('Failed to update event. Please try again.');
        },
      });
  }

  confirmDelete() {
    if (this.eventToEdit) {
      this.eventDeleted.emit(this.eventToEdit.id);
    }
  }

  closeModal() {
    this.modalClosed.emit();
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
