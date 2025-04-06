# Event Planner

## Live Demo
You can check out the live demo of the project here:  
[Event Planner Live Demo](https://thunderous-dusk-2a7de4.netlify.app/)

## Description
Event Planner is a simple application designed to help users plan and manage events. It allows users to create events, add dates to events, manage attendees, and track their availability for each event. The app provides API endpoints to interact with event data and attendees.

## Features
- Create events with multiple date options.
- Edit or patch event details.
- Delete events.
- View a list of all attendees and the events they are attending.
- Add dates to events after creation.
- Add attendee availability for events.
  
## API Endpoints

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


| Method | Endpoint                   | Body                                                                                          | Response                                                                                                                                  |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/events/               |                                                                                               | A list of all the events                                                                                                                  |
| GET    | /api/events/[id]           |                                                                                               | A single event                                                                                                                            |
| GET    | /api/attendees/            |                                                                                               | Get a list of all the attendees, and the events they're attending                                                                         |
| POST   | /api/events/               | `{ name: string, dates: array of dates ['YYYY-MM-DD'], author: string, description: string }` | Creates an event with `dates` as possibilities. You must provide an author, a name and a description for the event                        |
| PATCH  | /api/events/[id]/          | `{ name: string (optional), author: string (optional), description: string (optional) }`      | Patches (edit) an event with the provided infos                                                                                           |
| DELETE | /api/events/[id]/          |                                                                                               | Deletes an event                                                                                                                          |
| POST   | /api/events/[id]/add_dates | `{ dates: array of dates ['YYYY-MM-DD'] }`                                                    | Add some possible dates to an event                                                                                                       |
| POST   | /api/events/[id]/attend    | `{ name: string, dates : [ { date: date 'YYYY-MM-DD', available: boolean (true/false) } ] }`  | Add an attendance for the given event. You must provide the attendee's `name` and some availabilities, in the form of an array of object  |


How to Get Started
1. Clone the Repository
  ```bash
git clone https://github.com/inna77777/didlydoo-frontend.git
```

2.Navigate to the project directory:
```bash
cd didlydoo-frontend
```
3. Install Dependencies
```bash
npm install

```
4. Run project
```bash
npm start
```

