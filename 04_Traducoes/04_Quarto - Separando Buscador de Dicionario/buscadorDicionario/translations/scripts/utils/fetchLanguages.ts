import { BASE_URL } from './../constants';
import axios from 'axios';

export async function fetchLanguages(): Promise<string[]> {
  const { data } = await axios.get<string[]>(`${BASE_URL}/languages`);
  //const data = ['pt-BR'];
  return data;
}
