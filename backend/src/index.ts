// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import path from 'path';
import app from './app';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, '../.env') });

// const port = process.env.PORT || 5000;
const port = 5000;
app.listen(port, () => {
    console.log(`Listening to PORT: ${port}`);
});
