import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import endpoints from './endpoints';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(endpoints);

export default app;