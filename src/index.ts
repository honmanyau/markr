import express from 'express';
import helmet from 'helmet';
import * as database from '../database';
import { TEST_SERVER_PORT, SERVER_PORT } from '../markr.config';
import * as routes from './routes';

const port = process.env.NODE_ENV === 'test' ? TEST_SERVER_PORT : SERVER_PORT;
const app = express();

// =================
// == Middlewares ==
// =================
app.use(helmet());
app.use(express.text({ type: 'text/xml+markr' }));

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
database.init().then(() => {
  app.listen(port, () => {
    console.log(`Markr is listening at http://localhost:${port}`);
  });
});

export default process.env.NODE_ENV === 'test' ? app : null;
