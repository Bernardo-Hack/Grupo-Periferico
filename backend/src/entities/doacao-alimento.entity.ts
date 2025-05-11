import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class DoacaoAlimento {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.doacoesAlimento)
    usuario: Usuario;

    @Column({ length: 50 })
    tipo: string;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    quantidade_kg: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_doacao: Date;
}