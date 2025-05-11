import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/usuario.entity";
import { hash, compare} from "bcrypt";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export class UsuarioService {
    private usuarioRepository = AppDataSource.getRepository(Usuario);

    async criarUsuario(usuarioData: Omit<Usuario, "id" | "data_cadastro">): Promise<Usuario> {
        const hashedPassword = await hash(usuarioData.senha_hash, 10);
        const usuario = this.usuarioRepository.create({
            ...usuarioData,
            senha_hash: hashedPassword
        });
        return await this.usuarioRepository.save(usuario);
    }

    async autenticar(cpf: string, senha: string): Promise<string | null> {
        const usuario = await this.usuarioRepository.findOne({ where: { cpf } });
        if (!usuario) return null;

        const senhaValida = await compare(senha, usuario.senha_hash);
        if (!senhaValida) return null;

        return sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });
    }

    async encontrarPorId(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({ 
        where: { id },
        relations: ['doacoesDinheiro', 'doacoesRoupa', 'doacoesAlimento']
    });
}

    async listarUsuarios(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();
    }
}