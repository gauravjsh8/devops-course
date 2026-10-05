# **Project Application Requirements Specification**

## **Hotel Reservation Application**

---

# **1\. Stakeholders**

## **1.1 Hotel Management / Administrator**

The hotel management is responsible for managing the hotel and overseeing the application.

### **User needs**

- Manage hotel rooms and room information.
- Manage room prices and availability.
- View and manage reservations.
- Monitor hotel occupancy.
- View statistics such as reservations and revenue.
- Manage user and staff access where necessary.

## **1.2 Hotel Receptionist**

Receptionists interact with customers and manage reservations on their behalf.

### **User needs**

- View reservations.
- Check room availability.
- Create reservations for customers.
- Modify customer reservations.
- Cancel reservations when requested.
- Access relevant customer and reservation information.

## **1.3 Hotel Customer**

Customers use the application to find and reserve rooms.

### **User needs**

- Create an account and log in.
- Search for available rooms.
- View room information, prices and facilities.
- Make a reservation.
- Receive confirmation of a reservation.
- View their reservations.
- Modify or cancel their reservations.
- Know the total price and relevant info before confirming a reservation.
- Have their personal information protected.

---

# **2\. Overall Application Requirements**

# **2.1 Functional Requirements**

## **Users and Authentication**

### **2.1.1 User Registration**

The system should allow customers to create an account by providing the required personal information and login credentials.

### **2.1.2 User Login**

The system should allow registered users to log in securely.

### **2.1.3 User Logout**

The system should allow users to log out of their accounts.

### **2.1.4 User Roles and Permissions**

The system should differentiate between different types of users, such as customers, receptionists and administrators. Users should only have access to functions that are appropriate to their role.

---

## **Room and Availability Requirements**

### **2.1.5 Search Available Rooms**

Customers should be able to search for available rooms based on criteria such as:

- Check-in date.
- Check-out date.
- Number of guests.

### **2.1.6 Display Room Information**

The system should display relevant information about rooms, including:

- Room type.
- Number of beds.
- Maximum number of guests.
- Price.
- Facilities.
- Description.
- Photos, if available.
- Availability status

### **2.1.7 Display Booking Cost**

The system should display the relevant booking cost before the customer confirms the reservation.

_Tentative: display cost breakdown and cancellation policy._

### **2.1.8 Manage Room Information**

Hotel management staff are able to add, edit or deactivate rooms and their information.

### **2.1.9 Manage Room Prices**

Hotel management staff are able to update room prices.

### **2.1.10 Manage Room Availability**

Hotel staff are able to mark rooms as unavailable when necessary, for example because of maintenance.

Room availability should also be automatically updated when reservations start/end.

---

## **Reservation Requirements**

### **2.1.11 Create Reservation**

A customer should be able to reserve an available room.

An authorized receptionist shall also be able to create a reservation on behalf of a customer.

### **2.1.12 Prevent Overlapping**

The system should prevent the same room from being reserved by multiple customers for overlapping dates.

### **2.1.13 View Reservation**

Customers should be able to view their own reservations.

Receptionists and administrators shall be able to view reservations.

### **2.1.14 Modify Reservation**

Customers should be able to modify their own reservations.

Authorized receptionists shall be able to modify customer reservations.

### **2.1.15 Cancel Reservation**

Customers should be able to cancel their own reservations.

Authorized receptionists should also be able to cancel reservations on behalf of customers.

### **2.1.16 Reservation Confirmation**

After a successful reservation, the system should provide a confirmation containing relevant reservation information and it should have a unique reservation number.

### **2.1.17 Reservation Status**

The system should show the status of reservations:

- Confirmed or
- Cancelled

---

## **Receptionist Requirements**

### **2.1.18 View Reservations**

Receptionists shall be able to view current reservations.

### **2.1.19 Create Customer Reservation**

Receptionists are able to create a reservation on behalf of a customer.

### **2.1.20 Modify Customer Reservation**

Receptionists are able to modify an existing customer reservation.

### **2.1.21 Cancel Customer Reservation**

Receptionists should be able to cancel customer reservations when necessary.

---

## **Administration and Reporting Requirements**

### **2.1.22 Manage Hotel Rooms**

Administrators are able to manage the hotel's rooms and room information.

### **2.1.23 Manage Prices**

Administrators are able to manage room prices.

### **2.1.24 Manage Availability**

Administrators shall be able to manage room availability.

**2.1.25 View Hotel Statistics**

The system should provide hotel management with relevant statistics like:

- Number of reservations
- Occupancy stat
- Available rooms
- Cancelled reservations
- Revenue

---

# **2.2 Performance Requirements**

### **2.2.1 Application Response Time**

The application should normally respond to normal user actions within 2 sec maximum.

### **2.2.2 Room Search**

Room availability searches should normally return results in under 5 sec.

**2.2.3 Multiple Users at the same time**

The system should support multiple users using the application simultaneously.

---

# **2.3 Usability Requirements**

### **2.3.1 Easy Navigation**

Users should be able to navigate the application and find the main functions easily without needing tutorials.

### **2.3.2 Simple Reservation Process**

Customers should be able to search for a room, select dates and make a reservation easily.

### **2.3.3 Clear Information**

Room prices, availability, dates etc. should be clearly displayed.

### **2.3.4 Input Validation**

The system should validate user input and provide understandable error messages when incorrect information is entered.

### **2.3.5 User Feedback**

The system should clearly reflect whether an operation like creating, modifying or cancelling a reservation was successful or unsuccessful.

### **2.3.6 Responsive**

The application should provide a usable interface on desktop, tablet and mobile devices.

---

## **2.4 Reliability and Availability Requirements**

### **2.4.1 Reservation Consistency**

The system should maintain consistent reservation information even when multiple users try to reserve rooms at the same time.

### **2.4.2 Failure Handling**

If an operation fails, the system should inform the user and avoid leaving the reservation in an incorrect or incomplete state (end operation safely).

### **2.4.3 Data Persistence**

Confirmed reservations shall remain stored after a user logs out or the application is restarted.

### **2.4.4 Availability**

The application should be available and should recover appropriately from system failures.

---

# **2.5 Security Requirements**

### **2.5.1 Authentication**

Protected functions like CRUD should require the user to be authenticated.

### **2.5.2 Authorization**

The system shall restrict functions and information according to the user's role.

### **2.5.3 Customer Data**

Customers shall only be able to access their own personal and reservation information.

### **2.5.4 Administrative Actions**

Administrative functions shall only be accessible to authorized administrators.

### **2.5.5 Password Security**

User passwords shall not be stored as plain text.

### **2.5.6 Input Security**

The system shall validate and appropriately handle user input to reduce security risks.

---

# **2.6 Maintainability Requirements**

### **2.6.1 Modular Design**

The application should be divided into logical components so that individual parts can be modified without breaking the rest of the system.

### **2.6.2 Documentation**

The system should be documented to support future development and maintenance.

### **2.6.3 Testing**

Application functionality should be tested to reduce the risk of errors when the system is interacted with.

---

# **2.7 Compatibility and Integration Requirements**

### **2.7.1 Web Browser Compatibility**

The application should work in all modern web browsers.

### **2.7.3 Notification Integration**

The system should be able to communicate with an external email or notification service. (Tentative)

---

# **2.8 Constraints**

### **2.8.1 Hotel Policies**

The application shall follow the hotel's rules concerning room availability, prices, reservations and cancellations.

### **2.8.2 Privacy and Data Protection**

Customer information shall be handled according to privacy and data protection requirements.

### **2.8.3 Application Type**

The project will be implemented as a web-based hotel reservation application.

---

# **3\. Logical Subsystems**

The application can be divided into the following subsystems:

## **3.1 User Interface**

### **Purpose**

The user interface supports interaction between users and the application.

### **Inputs**

- User actions
- Login and registration information
- Search criteria
- Reservation information
- Modification and cancellation requests

### **Outputs**

- Room information
- Search results
- Reservation information
- Confirmation messages
- Error messages
- Notifications

### **Functional Requirements**

The User Interface should allow users to:

- Register and log in
- Search for rooms
- View room information
- Create reservations
- View, modify, and cancel reservations
- Access functions according to their role

### **Non-Functional Requirements**

The User Interface should:

- Be easy to navigate
- Provide clear feedback
- Validate user input
- Be responsive on different screen sizes
- Display important information clearly

---

## **3.2 Authentication and Authorization**

### **Purpose**

This subsystem manages user identity, login, and access permissions.

### **Inputs**

- Registration information
- Username/email
- Password
- Logout requests
- User role information

### **Outputs**

- Authentication result
- Login status
- User permissions
- Access granted or denied

### **Functional Requirements**

- Register users
- Authenticate users
- Log users out
- Identify user roles
- Control access

### **Non-Functional Requirements**

The subsystem should:

- Protect user credentials
- Prevent unauthorized access
- Handle authentication failures safely

---

## **3.3 Room Management**

### **Purpose**

The Room Management subsystem manages hotel rooms, room information, prices, and availability.

### **Inputs**

- Room information
- Room price changes
- Availability changes
- Room search criteria
- Existing reservation information

### **Outputs**

- Available rooms
- Room details
- Updated room information
- Updated availability

### **Functional Requirements**

- Store room information
- Search for available rooms
- Display room information
- Manage room prices
- Manage unavailable rooms
- Take existing reservations into account when determining availability

### **Non-Functional Requirements**

The subsystem should:

- Return search results quickly
- Maintain accurate room info (details and availability)

---

## **3.4 Reservation Management**

### **Purpose**

The Reservation Management subsystem handles the creation and management of hotel reservations.

### **Inputs**

- Customer information
- Selected room
- Check-in and check-out dates
- Number of guests
- Reservation modification or cancellation requests

### **Outputs**

- New reservation
- Reservation confirmation
- Reservation number
- Reservation status
- Updated reservation
- Cancellation result

### **Functional Requirements**

- Create reservations
- Check room availability
- Prevent overlapping reservations
- View reservations
- Modify reservations
- Cancel reservations
- Maintain reservation status
- Generate a unique reservation number

### **Non-Functional Requirements**

The subsystem shall:

- Maintain reservation consistency
- Prevent overlapping bookings by different users
- Store reservations reliably
- Handle failed operations safely

---

## **3.5 Notification Management**

### **Purpose**

The Notification Management subsystem handles notifications based on reservation or user events.

### **Inputs**

- Successful reservation
- Reservation modification
- Reservation cancellation
- Other relevant system events

### **Outputs**

- Booking confirmation
- Reservation update notification
- Cancellation notification

### **Functional Requirements**

The subsystem should:

- Generate relevant notifications.
- Send notifications through supported notification services or as pop-ups.

### **Non-Functional Requirements**

The subsystem should:

- Provide clear and accurate information
- Handle notification service failures safely
- Avoid sending incorrect reservation information

---

# **3.6 Administration and Reporting**

### **Purpose**

This subsystem provides hotel management with tools for managing the hotel and viewing relevant information.

### **Inputs**

- Room information
- Price information
- Availability changes
- Reservation data
- Reporting requests

### **Outputs**

- Updated room information
- Updated prices
- Availability information
- Reservation statistics
- Occupancy information
- Revenue information

### **Functional Requirements**

The subsystem should allow authorized administrators to:

- Manage rooms
- Manage prices
- Manage availability
- View reservations
- View relevant hotel statistics

### **Non-Functional Requirements**

The subsystem should:

- Restrict administrative functions to authorized users only
- Present statistics clearly and provide accurate information
