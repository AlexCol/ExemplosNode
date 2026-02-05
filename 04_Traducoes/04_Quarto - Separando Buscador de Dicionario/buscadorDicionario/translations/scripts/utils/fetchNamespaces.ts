import { BASE_URL } from './../constants';
import axios from 'axios';

export async function fetchNamespaces(): Promise<string[]> {
  const { data } = await axios.get<string[]>(`${BASE_URL}/namespaces`);
  return data;
}
