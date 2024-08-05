import { app } from './app';
import { SERVER } from './config/config';

const PORT = SERVER.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
