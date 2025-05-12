import { AppDataSource } from "../config/data-source";
import { DoacaoDinheiro } from "../entities/doacao-dinheiro.entity";
import { DoacaoRoupa } from "../entities/doacao-roupa.entity";
import { DoacaoAlimento } from "../entities/doacao-alimento.entity";
import { Usuario } from "../entities/usuario.entity";

export class DoacaoService {
    private dinheiroRepo = AppDataSource.getRepository(DoacaoDinheiro);
    private roupaRepo = AppDataSource.getRepository(DoacaoRoupa);
    private alimentoRepo = AppDataSource.getRepository(DoacaoAlimento);
    private usuarioRepo = AppDataSource.getRepository(Usuario);

    async criarDoacaoDinheiro(dados: {
        usuario_id: number;
        valor: number;
        metodo_pagamento: "pix" | "cartao" | "boleto";
    }) {
        const usuario = await this.usuarioRepo.findOne({ where: { id: dados.usuario_id } });
        if (!usuario) throw new Error("Usuário não encontrado");

        const doacao = this.dinheiroRepo.create({
            usuario,
            valor: dados.valor,
            metodo_pagamento: dados.metodo_pagamento
        });

        return await this.dinheiroRepo.save(doacao);
    }

    async criarDoacaoRoupa(dados: {
        usuario_id: number;
        tipo: string;
        quantidade: number;
        tamanho?: string;
    }) {
        const usuario = await this.usuarioRepo.findOne({ where: { id: dados.usuario_id } });
        if (!usuario) throw new Error("Usuário não encontrado");

        const doacao = this.roupaRepo.create({
            usuario,
            tipo: dados.tipo,
            quantidade: dados.quantidade,
            tamanho: dados.tamanho
        });

        return await this.roupaRepo.save(doacao);
    }

    async criarDoacaoAlimento(dados: {
        usuario_id: number;
        tipo: string;
        quantidade_kg: number;
    }) {
        const usuario = await this.usuarioRepo.findOne({ where: { id: dados.usuario_id } });
        if (!usuario) throw new Error("Usuário não encontrado");

        const doacao = this.alimentoRepo.create({
            usuario,
            tipo: dados.tipo,
            quantidade_kg: dados.quantidade_kg
        });

        return await this.alimentoRepo.save(doacao);
    }

    async listarDoacoes() {
        const dinheiro = await this.dinheiroRepo.find({ relations: ["usuario"] });
        const roupa = await this.roupaRepo.find({ relations: ["usuario"] });
        const alimento = await this.alimentoRepo.find({ relations: ["usuario"] });

        return { dinheiro, roupa, alimento };
    }
}