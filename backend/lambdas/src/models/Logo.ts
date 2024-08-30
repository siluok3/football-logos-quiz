export interface Logo {
  imageKey: string;
  difficulty: string;
  id: string;
  name: string;
  imageUrl: string;
}

interface Error {
  message: string;
}

export interface LogoResponse {
  body: Logo[] | string;
  statusCode: number;
}