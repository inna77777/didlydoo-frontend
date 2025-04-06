import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateAvailability, Event } from '../models/event.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  fetchEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(event: any, options: { headers: HttpHeaders }): Observable<any> {
    return this.http.post<Event>(this.apiUrl, event, options);
  }

  updateEvent(
    eventId: string,
    updatedData: Partial<Event>,
    options: { headers: HttpHeaders }
  ) {
    return this.http.patch(`${this.apiUrl}/${eventId}`, updatedData, options);
  }

  addDatesToEvent(
    id: string,
    dates: string[],
    options: { headers: HttpHeaders }
  ) {
    return this.http.post(`${this.apiUrl}/${id}/add_dates`, { dates }, options);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }

  postAttend(
    eventID: string,
    name: string,
    dates: DateAvailability[],
    availabilityArray: boolean[],
    options: { headers: HttpHeaders }
  ): Observable<any> {
    const formattedData = dates.map((date, index) => ({
      date: date.date,
      available: availabilityArray[index],
    }));
    const dataForSent = console.log('formattedData', formattedData);

    return this.http.post(
      `${this.apiUrl}/${eventID}/attend`,
      {
        name: name,
        dates: [...formattedData],
      },
      options
    );
  }
}
