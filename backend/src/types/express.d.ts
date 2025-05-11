import { Usuario } from "../entities/usuario.entity";

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}