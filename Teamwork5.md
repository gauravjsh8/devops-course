# Project Requirements Specification
## Stakeholders

- Hotel (client)--- hotel company that requested for this application to be built. Interested in statistics, how many users, how much revenue and how many rooms are occupied

- Hotel customers (enduser)----people who want to reserve hotel rooms. Expect easy and secure reservations

- Hotel Receptionist----can be contacted by hotel customers to reserve a room or modify an existing reservation

## Define the Overall Application Requirements

Functional requirements

- Hotel Customers should be able to register with the system

- Hotel Customers should be able to login to the system

- Hotel Customers should be able to search for the available rooms

- Hotel Customers should be able to get information about the searched room

- Hotel Customers should be able to reserve a room

- Hotel Customers should get a confirmation message after the reservation is confirmed

- Hotel Customers should be able to edit or cancel the reservation

### Performance Requirement

- Application should be able to load quickly

- Search function should return the searched room (if available)

Usability requirements

- Users should be able to figure out how to search, select dates and book without needing a manual or tutorial

- Room rates, taxes, hidden fees and cancellation policies should be transparently displayed

- The system should validate input

- UI must handle complex requests without breaking user flow

- If the user is not logged in, he/she shouldn’t be able to reserve a room

Reliability and availability

- The system should be able to recover after failure

- The system should work most of the time

- The system should block duplicate bookings

Security

- Users most log in to access their account

- Customers must only see their own bookings

- Admins should have higher permissions

- The system should validate input

Maintainability

- Software should be divided into modules

- The application should be documented

- The system should be tested

Compatibility and Integration

- The system should be able to integrate with other systems like payment system (stripe, PayPal, etc.), email service (node mailer, SendGrid, etc.)

Constraints

- The system must follow hotel rules

- Customer data must be protected

- The system should follow relevant privacy legislation

## Partition the Application into Logical Subsystems

The application can be divided into the following major subsystems:

3.1 User Interface Purpose- Provides a way for users to interact with the system. Inputs- User actions and information. Outputs- Results, modal messages, and displayed information.

Functional requirements- Users can enter data and view data. Non-functional requirements- Easy to use, responsive, and accessible.

3.2 Authentication & User Handler Purpose- Handle user accounts, login, and permissions. Inputs- Username/email, password. Outputs - Login status and access permissions.

Functional requirements- Register, login, logout, and manage user roles. Non-functional requirements- Secure, reliable, and fast.

3.3 Database Arrangement Purpose - Stores and manages application data. Inputs -Data and database queries. Outputs- Request or update records. Functional requirements - Create, read, update, and delete data.

3.4 Notifications Purpose - Sends important notice and confirmation to users. Inputs- System events based on user actions. Outputs - in-app notifications.

## Using Quality Function Deployment

### Normal Requirements

- Hotel customers should find available rooms easily

- Hotel customers can view room details (size, beds, possibly photos)

- See accurate room details.

- A hotel customer should be able to create an account

- A logged in user can reserve a room and see the change reflected in their system (under a reserved rooms page)

- Receive booking confirmation (with reservation number)

- Hotel customers should be able to modify or cancel reservation.

- Receptionists should be able to modify reservations if requested by hotel customer

- Administrator can manage and update room details (updating rooms, prices etc.)

- The application should be mobile-friendly.

- A hotel customer that is not logged in can view but **NOT** reserve a room.

### Expected Requirements

- User data should be secure.

- Fast search results

- Accurate information displayed for rooms

- Reserving a room should reflect in the system immediately (as soon as a room is reserved, it should not appear in search results afterwards)

Exciting requirements

- A chat box, to message hotel receptionist for real time communication.
