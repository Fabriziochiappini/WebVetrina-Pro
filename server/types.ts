import { Session } from 'express-session';
import { User } from '@shared/schema';

// Estendi il tipo Session di express-session per includere l'utente
declare module 'express-session' {
  interface Session {
    user?: User;
  }
}