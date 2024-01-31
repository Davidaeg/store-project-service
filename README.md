# Store Service

This is the "store-service" project. It's a Node.js application written in TypeScript.

## Main File

The main entry point for this application is `index.ts`.

## SetUp the project

In Order to run the project create an .env file with the following data (replace with your db info)

```
PORT=3000 //The port where you want to run the backEnd
DB_NAME=<dbname>
DB_USER=<dbuser>
DB_PASSWORD=<dbpassword>
DB_HOST=localhost
DB_PORT=1433 // mssql default port
```

- Execute `npm i` to install all dependencies.

## Scripts

Here are some of the npm scripts that you can run:

- `npm run dev`: Runs the application in development mode using `ts-node-dev`.
- `npm start`: Starts the application using the compiled JavaScript code in the `build` directory.
- `npm run tsc`: Compiles the TypeScript code to JavaScript.
- `npm test`: Currently, no tests are specified.

## Dependencies

This project uses the following dependencies:

- `express`: A minimal and flexible Node.js web application framework.

## Dev Dependencies

This project uses the following development dependencies:

- `@types/express`: TypeScript definitions for Express.js.
- `ts-node-dev`: A tool that restarts target node process when any of required files changes.
- `typescript`: A language for application-scale JavaScript development.

## License

This project is licensed under the ISC license.
