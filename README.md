# Smart Lost & Found Management System

A web-based application that simplifies reporting, tracking and recovering lost items in colleges, offices and public places. It replaces manual record keeping with a centralized platform where users can report items, search for matches and submit claims, while an administrator verifies ownership before approval.

## Features
- User registration and login
- Report lost items and submit found items (name, description, location, date, images)
- Search and filter items
- Match lost and found records
- Online claim submission
- Admin panel to manage users, verify reports and claims, and remove duplicate or false entries

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js, HTML, CSS |
| Backend | Java, Spring Boot, REST APIs |
| Database | MySQL |
| Build Tool | Maven |

## Entities
`User`, `Item`, `Claim`, `ItemStatus`, `ReportType`

## Project Structure
```
├── frontend/      # React.js application
├── src/           # Spring Boot backend source
└── pom.xml        # Maven configuration
```

## How to Run

### Prerequisites
- JDK 17 or higher (use the version your project is configured for)
- Node.js and npm
- MySQL

### Backend
1. Create a MySQL database (for example `lostandfound`).
2. Update the database username and password in `src/main/resources/application.properties`.
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```
   On Windows PowerShell: `.\mvnw.cmd spring-boot:run`

### Frontend
```bash
cd frontend
npm install
npm start
```

## Team (Batch 61)
- Naidu Tharuni Naga Pushpa
- Shaik Nayab Rasool
- Oleti Surendra Naidu
- Paripelly Manoj Reddy

**Guide:** Mrs. K. Aparna
Department of Computer Science & Engineering, Malla Reddy University