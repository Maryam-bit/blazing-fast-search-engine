import app from './app';
import { config } from './config/config';
import './db/postgres'


const port = config.port;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
});
