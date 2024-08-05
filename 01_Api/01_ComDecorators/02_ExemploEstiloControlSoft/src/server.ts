import express from 'express';
import { addAppConfigurations } from './config/appConfig/addAppConfigurations';
import { SERVER } from './config/general/config';

const app = express();
addAppConfigurations(app);

const PORT = SERVER.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
