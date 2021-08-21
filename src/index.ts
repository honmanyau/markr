import express from 'express';
import helmet from 'helmet';

const port = 4567;
const app = express();

// =================
// == Middlewares ==
// =================
app.use(helmet());

// ============
// == Routes ==
// ============
app.get('/', (_request, response) => {
  response.status(200).send({ ok: true });
});

// ===========
// == Start ==
// ===========
app.listen(port, () => {
  console.log(`Markr is listening at http://localhost:${port}`);
});

export default process.env.NODE_ENV === 'test' ? app : null;
