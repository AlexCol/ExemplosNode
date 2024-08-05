import dotenv from "dotenv";

dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY || '';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT
};