import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Certificado } from "./certificado.entity";

@Entity()
export class Distribuicao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    doacao_id: number;

    @Column({ type: "enum", enum: ["dinheiro", "roupa", "alimento"] })
    tipo_doacao: "dinheiro" | "roupa" | "alimento";

    @Column({ type: "date" })
    data_distribuicao: Date;

    @ManyToOne(() => Usuario, usuario => usuario.distribuicoesAdmin)
    admin: Usuario;

    @ManyToOne(() => Usuario, usuario => usuario.distribuicoesVoluntario, { nullable: true })
    usuario_voluntario?: Usuario;

    @OneToOne(() => Certificado, certificado => certificado.distribuicao)
    certificado: Certificado;
}