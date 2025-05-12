import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DoacaoDinheiro } from "./doacao-dinheiro.entity";
import { DoacaoRoupa } from "./doacao-roupa.entity";
import { DoacaoAlimento } from "./doacao-alimento.entity";
import { Distribuicao } from "./distribuicao.entity";
import { Certificado } from "./certificado.entity";

console.log("PrimaryGeneratedColumn", PrimaryGeneratedColumn); // deve ser uma função

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nome: string;

    @Column({ length: 14, unique: true })
    cpf: string;

    @Column({ length: 20 })
    telefone: string;

    @Column({ length: 255 })
    senha_hash: string;

    @Column({ type: "enum", enum: ["admin", "doador"], default: "doador" })
    tipo: "admin" | "doador";

    @Column({ type: "date" })
    data_nascimento: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_cadastro: Date;

    // Relações
    @OneToMany(() => DoacaoDinheiro, doacao => doacao.usuario)
    doacoesDinheiro: DoacaoDinheiro[];

    @OneToMany(() => DoacaoRoupa, doacao => doacao.usuario)
    doacoesRoupa: DoacaoRoupa[];

    @OneToMany(() => DoacaoAlimento, doacao => doacao.usuario)
    doacoesAlimento: DoacaoAlimento[];

    @OneToMany(() => Distribuicao, distribuicao => distribuicao.admin)
    distribuicoesAdmin: Distribuicao[];

    @OneToMany(() => Distribuicao, distribuicao => distribuicao.usuario_voluntario)
    distribuicoesVoluntario: Distribuicao[];

    @OneToMany(() => Certificado, certificado => certificado.usuario)
    certificados: Certificado[];
}