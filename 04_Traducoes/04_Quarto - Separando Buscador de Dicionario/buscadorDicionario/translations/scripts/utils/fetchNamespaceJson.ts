import { BASE_URL } from './../constants';
import axios from 'axios';

export async function fetchNamespaceJson(language: string, namespace: string): Promise<Record<string, string>> {
  const { data } = await axios.get(`${BASE_URL}/${language}/${namespace}`);
  return data;
}
