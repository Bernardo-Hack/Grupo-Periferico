import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Distribuicao } from "./distribuicao.entity";

@Entity()
export class Certificado {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.certificados)
    usuario: Usuario;

    @OneToOne(() => Distribuicao, distribuicao => distribuicao.certificado)
    distribuicao: Distribuicao;

    @Column({ type: "date" })
    data_emissao: Date;
}