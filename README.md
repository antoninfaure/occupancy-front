# :clock1: [Occupancy FLEP - Frontend](https://occupancy.flep.ch/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Interface of edu.epfl.ch, useful for finding free rooms or schedule by studyplan.

## Features

- **Room Availability**: Find available rooms based on selected date and time ranges. The system displays rooms that are not booked during the specified time slots.
  
- **Retrieve Course Information**: Easily find detailed information about a specific course by providing its code. The system retrieves details such as the course's semester, assigned teachers, and schedules.

- **Explore Study Plans**: Explore study plans using their unique study plan ID. The application showcases an interactive and organized timetable that covers the entire semester, highlighting courses, schedules, and room bookings.

## Backend
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

The backend repository can be found **[here](https://github.com/antoninfaure/occupancy-epfl)**

## Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

The current repository is for the frontend, which is a React App using TypeScript and SASS, and hosted on GitHub Pages.

### Run

1. First you need to set the `homepage` value in `package.json` to the corresponding url (eg. http://localhost:3000 for local)

2. Be sure to install all the dependencies using `npm run install -r requirements.txt`.

Next in the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Contributing

Pull requests are welcome :smile:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
