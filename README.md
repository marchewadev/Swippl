# About Swippl

Swippl Chat App is a web application introducing a chat roulette feature, enabling users to select categories for matching with other users. Optional account creation enhances the experience by providing benefits such as profile customization and friend management to facilitate continued conversations. If you prefer, you can set up the project locally or test it directly on https://www.swippl.pl/

https://github.com/marchewadev/Swippl/assets/23455210/a633ead9-5125-4097-8cce-24b61643a7ae

## Installation

```bash
git clone https://github.com/marchewadev/Swippl.git
cd Swippl/client
npm install
cd ../server
npm install
```

## Before usage
Before using the application, ensure that nodemon and PostgreSQL are installed on your machine. Then, create and configure .env files inside the client and server folders as outlined below:

### Client
```
VITE_BACKEND_SERVER=localhost:3000
```

### Server
Ensure you've created the database beforehand. Then, populate the .env file with your database credentials:

```
DB_USER=your_db_data
DB_HOST=your_db_data
DB_NAME=your_db_data
DB_PASSWORD=your_db_data
DB_PORT=your_db_data
```

## Usage
To start using the application, execute the following commands:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```
