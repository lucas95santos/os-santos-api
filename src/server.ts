import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
// routes
import routes from './routes';
// db connection
import './database';
// exceptions
import ExceptionHandler from './exceptions/ExceptionHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(ExceptionHandler.execute);

// --------------------------------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
