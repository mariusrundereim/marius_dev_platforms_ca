# Api Documentation

## Endpoints

- Venues
- Events
- Tickets
- Attendees
- Companies

## Venues

### Get All Venues

- **Endpoint**: `/venues`
- **Method**: GET
- **Description**: Retrieves a list of all venues.
- **Success Response**: HTTP 200 (OK) with an array of venue objects.
- **Error Response**: HTTP 500 (Internal Server Error) with an error message.

### Get Single Venue by ID

- **Endpoint**: `/venues/:id`
- **Method**: GET
- **Description**: Fetches details of a specific venue by its ID.
- **Success Response**: HTTP 200 (OK) with the venue's details.
- **Error Response**: HTTP 404 (Not Found) if the venue does not exist, or HTTP 500 (Internal Server Error) with an error message.

### Create Venue

- **Endpoint**: `/venues`
- **Method**: POST
- **Description**: Registers a new venue with title, location, website, phone, and email.
- **Body**:
  ```json
  {
    "title": "string",
    "location": "string",
    "website": "string",
    "phone": "string",
    "email": "string"
  }
  ```
- **Success Response**: HTTP 201 (Created) with the venue ID and creation message.
- **Error Response**: HTTP 400 (Bad Request) for missing fields, HTTP 409 (Conflict) if the venue name already exists, or HTTP 500 (Internal Server Error) with an error message.

### Update Venue

- **Endpoint**: `/venues/:id`
- **Method**: PUT
- **Description**: Updates details for an existing venue by its ID.
- **Body**:
  ```json
  {
    "title": "string",
    "location": "string",
    "website": "string",
    "phone": "string",
    "email": "string"
  }
  ```
- **Success Response**: HTTP 200 (OK) with a message indicating successful update.
- **Error Response**: HTTP 404 (Not Found) if the venue does not exist, or HTTP 500 (Internal Server Error) with an error message.

### Delete Venue

- **Endpoint**: `/venues/:id`
- **Method**: DELETE
- **Description**: Removes a venue by its ID.
- **Success Response**: HTTP 200 (OK) with a message indicating successful deletion.
- **Error Response**: HTTP 404 (Not Found) if the venue does not exist, or HTTP 500 (Internal Server Error) with an error message.

## Events

### Get All Events

- **Endpoint**: `/events`
- **Method**: GET
- **Description**: Retrieves all events.
- **Success Response**: HTTP 200, list of events.
- **Error Response**: HTTP 500, server error.

### Create Event

- **Endpoint**: `/events`
- **Method**: POST
- **Description**: Creates a new event with title, description, dates, venue, and company ID.
- **Body**:

```json
{
  "title": "string",
  "description": "string",
  "startDate": "date",
  "endDate": "date",
  "venueId": "string",
  "companyId": "string"
}
```

- **Success Response**: HTTP 201, event created.
- **Error Response**: HTTP 400/404/409, missing fields or duplicate.

### Single Event by ID

- **Endpoint**: `/events/:id`
- **Method**: GET
- **Description**: Fetches a specific event by ID.
- **Success Response**: HTTP 200, event details.
- **Error Response**: HTTP 404/500, not found or server error.

### Get Tickets by Event

- **Endpoint**: `/events/:id/tickets`
- **Method**: GET
- **Description**: Retrieves tickets for a specific event.
- **Success Response**: HTTP 200, tickets list.
- **Error Response**: HTTP 404/500, event not found or server error.

### Delete Event

- **Endpoint**: `/events/:id`
- **Method**: DELETE
- **Description**: Deletes a specific event by ID.
- **Success Response**: HTTP 200, event deleted.
- **Error Response**: HTTP 400/404/409/500, missing ID, not found, cannot delete with tickets, or server error.

## Tickets

### Get All Tickets

- **Endpoint**: `/tickets`
- **Method**: GET
- **Description**: Retrieves all tickets.
- **Success Response**: HTTP 200, list of tickets.
- **Error Response**: HTTP 500, server error.

### Get Tickets for Specific Event

- **Endpoint**: `/tickets/:event_ID`
- **Method**: GET
- **Description**: Fetches tickets for a given event ID.
- **Success Response**: HTTP 200, tickets for the event.
- **Error Response**: HTTP 404 (no tickets found), HTTP 500 (server error).

### Create Ticket

- **Endpoint**: `/:event_ID/tickets`
- **Method**: POST
- **Description**: Creates a ticket for an event, requiring price, quantity, and attendee ID.
- **Body**:

```json
{
  "price": "number",
  "quantity": "number",
  "attendeeId": "string"
}
```

- **Success Response**: HTTP 201, ticket created.
- **Error Response**: HTTP 400/404/409 (missing fields, event/attendee not found, or ticket exists), HTTP 500 (server error).

### Delete Ticket

- **Endpoint**: `/tickets/:id`
- **Method**: DELETE
- **Description**: Deletes a ticket by ID.
- **Success Response**: HTTP 200, ticket deleted.
- **Error Response**: HTTP 404 (ticket not found), HTTP 500 (server error).

## Attendees

### Get All Attendees

- **Endpoint**: `/attendees`
- **Method**: GET
- **Description**: Retrieves a list of all attendees.
- **Success Response**: HTTP 200, with attendees list.
- **Error Response**: HTTP 500, server error.

### Create Attendee

- **Endpoint**: `/attendees`
- **Method**: POST
- **Description**: Registers a new attendee with first name, last name, email, phone, and optionally, ticket ID.
- **Body**:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "ticketId": "string (optional)"
}
```

- **Success Response**: HTTP 201, attendee created.
- **Error Response**: HTTP 400/404/500, missing fields or server error.

### Get Single Attendee by ID

- **Endpoint**: `/attendees/:id`
- **Method**: GET
- **Description**: Fetches details of a single attendee by ID.
- **Success Response**: HTTP 200, attendee details.
- **Error Response**: HTTP 404/500, not found or server error.

### Delete Attendee

- **Endpoint**: `/attendees/:id`
- **Method**: DELETE
- **Description**: Removes an attendee by ID.
- **Success Response**: HTTP 200, attendee deleted.
- **Error Response**: HTTP 404/500, not found or server error.

### Update Attendee

- **Endpoint**: `/attendees/:id`
- **Method**: PATCH
- **Description**: Updates information for an attendee.
- **Body**: Fields to update.
- **Success Response**: HTTP 200, attendee updated.
- **Error Response**: HTTP 400/404/500, no update fields, not found, or server error.

## Companies

### Get All Companies

- **Endpoint**: `/companies`
- **Method**: GET
- **Description**: Retrieves all companies.
- **Success Response**: HTTP 200, with list of companies.
- **Error Response**: HTTP 500, server error.

### Find Company

- **Endpoint**: `/companies/:id`
- **Method**: GET
- **Description**: Fetches a single company by ID.
- **Success Response**: HTTP 200, with company details.
- **Error Response**: HTTP 404 (company not found), HTTP 500 (server error).

### Create Company

- **Endpoint**: `/companies`
- **Method**: POST
- **Description**: Creates a new company with specified details.
- **Body**:

```json
{
  "companyName": "string",
  "orgNumber": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "website": "string"
}
```

- **Success Response**: HTTP 201, with company ID.
- **Error Response**: HTTP 400 (missing fields), HTTP 409 (duplicate name), HTTP 500 (server error).

### Get Companies with Events

- **Endpoint**: `/companies/:id/events`
- **Method**: GET
- **Description**: Retrieves a company and its associated events by company ID.
- **Success Response**: HTTP 200, with company and events details.
- **Error Response**: HTTP 404 (company not found), HTTP 500 (server error).
