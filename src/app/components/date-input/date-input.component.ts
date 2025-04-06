import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class DateInputComponent {
  private _initialDate: string = '';

  @Input()
  set initialDate(value: string) {
    this._initialDate = value;
    this.initialDateChange.emit(this._initialDate);
  }

  get initialDate(): string {
    return this._initialDate;
  }

  @Output() initialDateChange = new EventEmitter<string>();

  private _newDates: { date: string; attendees: any[] }[] = [];

  @Input()
  set newDates(value: { date: string; attendees: any[] }[]) {
    this._newDates = value;
    this.newDatesChange.emit(this._newDates);
  }

  get newDates(): { date: string; attendees: any[] }[] {
    return this._newDates;
  }

  @Output() newDatesChange = new EventEmitter<
    { date: string; attendees: any[] }[]
  >();
  @Output() dateAdded = new EventEmitter<string>();
  @Output() dateRemoved = new EventEmitter<number>();

  addNewDate(date: string) {
    if (date) {
      this._newDates.push({ date: date, attendees: [] });
      this.initialDate = '';
      this.newDatesChange.emit(this._newDates);
    }
  }

  removeNewDate(index: number) {
    this._newDates.splice(index, 1);
    this.newDatesChange.emit(this._newDates);
  }
}
