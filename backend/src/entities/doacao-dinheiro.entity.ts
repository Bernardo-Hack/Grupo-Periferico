import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class DoacaoDinheiro {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.doacoesDinheiro)
    usuario: Usuario;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    valor: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_doacao: Date;

    @Column({ type: "enum", enum: ["pix", "cartao", "boleto"] })
    metodo_pagamento: "pix" | "cartao" | "boleto";
}