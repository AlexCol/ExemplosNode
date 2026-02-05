import path from 'path';

const env = 'dev';
export const BASE_URL = `http://localhost:3000/catalog/${env}/backend`;
export const OUTPUT_DIR = path.resolve(process.cwd(), 'src/translations/jsons');
