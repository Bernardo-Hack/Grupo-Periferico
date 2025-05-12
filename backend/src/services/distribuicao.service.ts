import { AppDataSource } from "../config/data-source";
import { Distribuicao } from "../entities/distribuicao.entity";
import { Usuario } from "../entities/usuario.entity";
import { Certificado } from "../entities/certificado.entity";

export class DistribuicaoService {
    private distribuicaoRepo = AppDataSource.getRepository(Distribuicao);
    private usuarioRepo = AppDataSource.getRepository(Usuario);
    private certificadoRepo = AppDataSource.getRepository(Certificado);

    async criarDistribuicao(dados: {
        doacao_id: number;
        tipo_doacao: "dinheiro" | "roupa" | "alimento";
        data_distribuicao: Date;
        admin_id: number;
        usuario_voluntario_id?: number;
    }) {
        const admin = await this.usuarioRepo.findOne({ where: { id: dados.admin_id } });
        if (!admin || admin.tipo !== "admin") throw new Error("Admin não encontrado ou inválido");

        let voluntario: Usuario | undefined;
        if (dados.usuario_voluntario_id) {
            voluntario = await this.usuarioRepo.findOne({ where: { id: dados.usuario_voluntario_id } });
            if (!voluntario) throw new Error("Voluntário não encontrado");
        }

        const distribuicao = this.distribuicaoRepo.create({
            doacao_id: dados.doacao_id,
            tipo_doacao: dados.tipo_doacao,
            data_distribuicao: dados.data_distribuicao,
            admin,
            usuario_voluntario: voluntario
        });

        const savedDistribuicao = await this.distribuicaoRepo.save(distribuicao);

        // Criar certificado se houver voluntário
        if (voluntario) {
            const certificado = this.certificadoRepo.create({
                usuario: voluntario,
                distribuicao: savedDistribuicao,
                data_emissao: new Date()
            });
            await this.certificadoRepo.save(certificado);
        }

        return savedDistribuicao;
    }

    async listarDistribuicoes() {
        return await this.distribuicaoRepo.find({
            relations: ["admin", "usuario_voluntario", "certificado"]
        });
    }
}