import "dotenv/config";
import { createApp } from "./app.js";
import { store } from "./data/store.js";
const port = Number(process.env.PORT || 3000);
createApp(store).listen(port, () => console.log(`http://localhost:${port}`));
