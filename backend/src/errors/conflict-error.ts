import { CONFLICT } from './error-status';

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

export default ConflictError;
