import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-availability',
  templateUrl: './event-availability.component.html',
  styleUrls: ['./event-availability.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class EventAvailabilityComponent {
  @Input() event!: Event;
  @Input() selectedAvailabilityEventId: string | null = null;

  @Output() attendanceSubmitted = new EventEmitter<void>();

  username: string = '';
  availabilitiesMap: { [key: string]: boolean[] } = {};

  constructor(private eventService: EventService) {}

  ngOnInit() {
    if (this.event && this.event.id) {
      this.availabilitiesMap[this.event.id] = this.event.dates.map(() => false);
    }
  }

  toggleAvailability(eventId: string, dateIndex: number): void {
    const availability = this.availabilitiesMap[eventId];
    if (!availability) return;
    availability[dateIndex] = !availability[dateIndex];
  }

  isAvailable(eventId: string, dateIndex: number): boolean {
    return this.availabilitiesMap[eventId]?.[dateIndex] ?? false;
  }

  sendAttendance(event: Event): void {
    if (!this.username.trim()) return;

    const availabilityArray = this.availabilitiesMap[event.id];
    if (!availabilityArray) {
      console.error('No availability data found for the event.');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.eventService
      .postAttend(event.id, this.username, event.dates, availabilityArray, {
        headers,
      })
      .subscribe({
        next: () => {
          this.username = '';
          this.availabilitiesMap[event.id] = event.dates.map(() => false);

          this.attendanceSubmitted.emit(); 
        },
        error: (err) => console.error('Error sending attendance:', err),
      });
  }
}
