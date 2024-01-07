# :clock1: [Occupancy FLEP - Frontend](https://occupancy.flep.ch/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub Pages](https://github.com/antoninfaure/occupancy-front/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/antoninfaure/occupancy-front/actions/workflows/pages/pages-build-deployment)

Interface of edu.epfl.ch, useful for finding free rooms or schedule by studyplan.

## Features

- **Room Availability**: Find available rooms based on selected date and time ranges. The system displays rooms that are not booked during the specified time slots.
  
- **Retrieve Course Information**: Easily find detailed information about a specific course by providing its code. The system retrieves details such as the course's semester, assigned teachers, and schedules.

- **Explore Study Plans**: Explore study plans using their unique study plan ID. The application showcases an interactive and organized timetable that covers the entire semester, highlighting courses, schedules, and room bookings.

## Backend
![Node.js](https://img.shields.io/badge/Node.js-%23000.svg?style=for-the-badge&logo=Node.js&logoColor=white&color=%23339933) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%23000.svg?style=for-the-badge&logo=MongoDB&logoColor=white&color=%2347A248) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white) 

The backend repository can be found **[here](https://github.com/antoninfaure/occupancy-epfl)**

## Scraper
 ![Python](https://img.shields.io/badge/Python-%23000.svg?style=for-the-badge&logo=Python&logoColor=white&color=%233776AB) ![MongoDB](https://img.shields.io/badge/MongoDB-%23000.svg?style=for-the-badge&logo=MongoDB&logoColor=white&color=%2347A248) ![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

The scraper repository can be found **[here](https://github.com/antoninfaure/occupancy-scraper)**

## Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

The current repository is for the frontend, which is a React App using TypeScript and SASS, and hosted on GitHub Pages.

### Setup

To get started with this project, clone the repository and install dependencies:

```bash
git clone https://github.com/antoninfaure/occupancy-front
cd occupancy-front
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run start
```

And navigate to [http://localhost:3000](http://localhost:3000).

(To change the port you can set the env variable `VITE_PORT`)

## Build

To build the project for production:

```bash
npm run build
```

## Serve

To preview the production build locally:

```bash
npm run serve
```

## Contributing

Pull requests are welcome :smile:

This project was bootstrapped with [ViteJS](https://vitejs.dev/).
