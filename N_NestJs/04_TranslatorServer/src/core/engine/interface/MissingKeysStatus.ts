export interface MissingKeysStatus {
  total: number;
  namespaces: Record<string, number>;
}

export interface AvailableLanguages {
  [env: string]: {
    [sistema: string]: string[];
  };
}
