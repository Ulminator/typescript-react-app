import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  if(req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      console.log(`${req.ip} ${req.method} ${req.url}`);
      next();
  }
});

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).send('It works');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`http://localhost:8080`);
});

export default app;
