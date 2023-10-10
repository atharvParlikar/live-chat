# Live chat

This is a basic live chat with voting, created with firebase + React

## Setup

1. create a firebase project [here](https://console.firebase.google.com/)
2. clone the this repo using `git clone https://github.com/atharvParlikar/live-chat`
3. Install packages (yarn / npm install / bun install/ pnpm)
4. copy the firebase config from firebase console and put it in .env
    - ues following prompt for chatgpt to do the bitchwork for you.
    - `convert the following javascript object to .env file, capitalize everything and convert camel case to snake case also add VITE prefix to every key`
5. add these additional things in .env file
    - VITE_DOWNVOTE= true / false (adds downvote if true)
	- VITE_COOLDOWN= x seconds (eg. 60)
	- VITE_ADMIN_MAIL= email of admin
6. Add a realtime database in your project and update VITE_DATABASE_URL in .env as necessary
7. run command `npm run dev`
