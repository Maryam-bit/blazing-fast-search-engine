import app from './app';
import { config } from './config/config';
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
});
