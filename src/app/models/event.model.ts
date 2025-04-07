export interface Attendee {
  name: string;
  available: boolean;
}

export interface DateAvailability {
  date: string;
  attendees: Attendee[];
}

export interface Event {
  id: string;
  name: string;
  author: string;
  description: string;
  dates: DateAvailability[];
}
