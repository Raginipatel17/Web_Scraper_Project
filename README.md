# Event Web Scraper

A full-stack web application that automatically scrapes event information from a Sydney-based events website and displays it in a clean, user-friendly interface.

## Overview

This project collects event data from an external website and stores it in a database so users can easily browse and explore upcoming events. The system automatically refreshes the event listings to ensure the information remains up to date.

The application also categorizes events to help track changes, such as newly added events, updated details, or inactive listings.

## Features

* Automatic scraping of event information from a public events website
* Scheduled data refresh to keep listings updated
* Event categorization using **New**, **Updated**, and **Inactive** tags
* Responsive frontend interface for browsing events
* Direct link to the original event page for registration or more details
* REST API for retrieving event data

## Tech Stack

**Frontend**

* React
* JavaScript
* HTML
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB

**Other Tools**

* Web scraping library (Cheerio / Axios / Puppeteer)
* Git & GitHub
* Postman for API testing

## How It Works

1. A backend scraper fetches HTML data from the events website.
2. The scraper extracts relevant event information such as:

   * Event title
   * Date and time
   * Location
   * Event description
   * Event link
3. The extracted data is stored in MongoDB.
4. A scheduled job runs periodically to check for updates.
5. The frontend fetches event data from the backend API and displays it to users.

## Project Structure

```
project-root
│
├── client          # React frontend
│
├── server          # Node.js backend
│   ├── scraper
│   ├── routes
│   ├── models
│
└── README.md
```

## Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/event-web-scraper.git
cd event-web-scraper
```

### 2. Install dependencies

Backend

```
cd server
npm install
```

Frontend

```
cd client
npm install
```

### 3. Environment variables

Create a `.env` file in the backend folder.

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run the application

Start backend

```
npm start
```

Start frontend

```
npm run dev
```

## Future Improvements

* Add search and filtering for events
* Add event categories (music, sports, workshops)
* Improve scraper performance and error handling
* Add user authentication and event bookmarking
* Add pagination for large event datasets


## Links

Live Demo: [Open Project](https://web-scraper-project01.vercel.app/)


## Author

Ragini Kumari
