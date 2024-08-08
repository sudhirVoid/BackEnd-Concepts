import express, { Request, Response } from 'express';
import { rateLimiter } from './ratelimiter';

const app = express();
app.use(rateLimiter);
app.get('/rateLimiter', (req: Request, res: Response) => {
    console.log('Hello, TypeScript Express!');
    res.send(res.locals.msg);
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });