import express from 'express';
import helmet from 'helmet';
import * as database from './database';
import { SERVER_PORT, UPLOAD_LIMIT } from '../markr.config';
import * as routes from './routes';

const app = express();

// =================
// == Middlewares ==
// =================
app.use(helmet());
app.use(
  express.text({
    type: 'text/xml+markr',
    limit: UPLOAD_LIMIT,
  })
);

// ============
// == Routes ==
// ============
app.get('/', (_request, response) => {
  response.status(200).send({ ok: true });
});
app.use('/import', routes.import);
app.use('/results', routes.results);

// ===========
// == Start ==
// ===========
app.on('ready', () => {
  app.listen(SERVER_PORT, () => {
    console.log(`Markr is listening at http://localhost:${SERVER_PORT}`);
  });
});

if (process.env.NODE_ENV !== 'test') {
  database.init().then(() => {
    app.emit('ready');
  });
}

export { app, database };
