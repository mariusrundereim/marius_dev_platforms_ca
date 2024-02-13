# Event Management API

## Overview

Course Assignment for Development Platforms. Goal is to create and host a functional RESTful API.
Focus will be to understand datastores and backend solutions commonly used in a full-stack web development.
This project will demonstrate my ability to implement **CRUD (Create, Read, Update, Delete)** REST endpoints.

## Learning outcomes

- Service and APIs used to deliver intergrated full-stack solutions.
- Processes and tools used in front-end projects with cloud-based backend platforms and self-hosted APIs.

## Stack

- Node.js
- MongoDB
- AWS EC2 (Hosting)
- Postman (API testing)

## Database

- **Venues**: Holds information about event locations.
- **Events**: Details of individual events.
- **Tickets**: Information on tickets for events.
- **Attendees**: Data on individuals attending events.
- **Companies**: Information about companies involved in events.

## Endpoints

### Events

- `GET /events`: List all events.
- `POST /events`: Create a new event.

### Tickets

- `POST /events/:eventId/tickets`: Create a ticket for an event.
- `GET /events/:eventId/tickets`: List tickets for an event.

### Attendees

- `GET /attendees`: List all attendees.
- `POST /attendees`: Register a new attendee.

### Companies

- `GET /companies`: List all companies.
- `POST /companies`: Add a new company.
