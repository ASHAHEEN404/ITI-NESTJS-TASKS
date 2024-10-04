import { User } from './users/Schemas/users.schema'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property
    }
  }
}
