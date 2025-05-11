import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class DoacaoRoupa {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.doacoesRoupa)
    usuario: Usuario;

    @Column({ length: 50 })
    tipo: string;

    @Column()
    quantidade: number;

    @Column({ length: 10, nullable: true })
    tamanho?: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_doacao: Date;
}