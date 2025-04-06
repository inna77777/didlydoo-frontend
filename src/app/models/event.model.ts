// export class Event {
//   id: string;
//   name: string;
//   author: string;
//   description: string;
//   dates: DateAvailability[];

//   constructor(
//     id: string = '',
//     name: string = '',
//     author: string = '',
//     description: string = '',
//     dates: DateAvailability[] = []
//   ) {
//     this.id = id;
//     this.name = name;
//     this.author = author;
//     this.description = description;
//     this.dates = dates;
//   }
// }

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
