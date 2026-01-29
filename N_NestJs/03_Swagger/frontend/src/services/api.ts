// src/services/api.ts (seu serviço existente com ajustes)
import axios, { AxiosError } from "axios";

const baseUrl = "http://localhost:3000"; //process.env.NEXT_PUBLIC_API;
const core = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let onAuthFail: (() => void) | null = null;
export function setAuthFailHandler(handler: () => void) {
  onAuthFail = handler;
}

// ✅ Este é o importante: exportar uma função que retorna o AxiosInstance
// O Orval consegue trabalhar direto com Axios instances
export function getApiClient() {
  return core;
}

// ✅ Manter suas funções auxiliares existentes
export function setRememberMe(rememberMe: boolean) {
  if (!rememberMe) {
    delete core.defaults.headers.common["remember-me"];
  } else {
    core.defaults.headers.common["remember-me"] = rememberMe;
  }
}

export function forgetMe() {
  delete core.defaults.headers.common["remember-me"];
}

export function getBackendBaseUrl() {
  return baseUrl?.replace("/api/", "/api") || "";
}

// ✅ Adicionar interceptadores para tratamento de erro
core.interceptors.response.use(
  (response) => response,
  (error) => {
    handleException(error);
  },
);

function handleException(error: unknown) {
  let errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";

  if (error instanceof AxiosError) {
    errorMessage = error.response?.data?.message || errorMessage;
    checkIfNeedToLogout(error);
  }

  return Promise.reject(new Error(errorMessage));
}

function checkIfNeedToLogout(error: AxiosError) {
  if (!error.response) return;
  const statusCode = error.response.status;
  if (statusCode === 401 && onAuthFail) {
    onAuthFail();
  }
}
