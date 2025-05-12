import express from 'express';
import path from 'path';
import db from './config/db';
import mainroutes from './routes/index';
const { hashPassword } = require('./encript/authhelp');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/', mainroutes);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

import { RowDataPacket } from 'mysql2';

app.get('/adminUserDashboard', async (req, res) => {
    console.log("Rota /admin_dashboard acessada");
    try {
        // Versão com tipagem explícita
        const [results] = await db.query<RowDataPacket[]>('SELECT * FROM usuario ORDER BY nome');
        
        // Garante que é um array mesmo se a query falhar
        const usuarios = (results as RowDataPacket[]) || [];
        
        console.log('Usuários encontrados:', usuarios.length);
        
        console.log('Usuários para render:', usuarios);
        res.render("admin_dashboard", {
            usuarios: usuarios || [], // Garante array mesmo se for undefined
            currentDate: new Date().toLocaleDateString('pt-BR'), // Data atual
            pageTitle: "Painel Administrativo" // Título da página
        });

        
    } catch (error) {
        console.error("Erro completo:", {
            message: error.message,
            stack: error.stack,
       
     sqlError: error.sqlMessage
        });
        res.render("admin_dashboard", {
            usuarios: []
        });
    }
});



app.get('/adminMonetaryDonationDashboard', async (req, res) => {
    try {
        const [results] = await db.query<RowDataPacket[]>(`
            SELECT d.id, u.nome, d.valor, d.metodo_pagamento, d.data_doacao
            FROM DoacaoDinheiro d
            JOIN Usuario u ON d.usuario_id = u.id
            ORDER BY d.data_doacao DESC
        `);

        const doacoes = results as RowDataPacket[];

        res.render('admin_doacoes', {
            doacoes,
            pageTitle: "Doações em Dinheiro"
        });

    } catch (error) {
        console.error("Erro ao buscar doações:", error);
        res.render('admin_doacoes', {
            doacoes: [],
            pageTitle: "Doações em Dinheiro"
        });
    }
});



app.post('/resgister_us' ,async (req, res) => {
    try {
        const{nome, cpf, te, phone, email, password,dt_nsc} = req.body;
        
        const hashedPassword = await hashPassword(password);


    }
    catch (error) {};
});

// app.post('/register_user', async (req, res) => {
//     try {
//         const { name, dt_birth, cpf, address, phone, email, password } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ error: 'Campos obrigatórios faltando' });
//         }

//         const query = `
//             INSERT INTO usuarios 
//                 (nome, dt_nascimento, cpf, endereco, telefone, email, senha) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7) 
//             RETURNING id`;
        
//         const result = await db.query(query, [
//             name, dt_birth, cpf, address, phone, email, password
//         ]);

//         const userId = result.rows[0].id;

//         // 3. Upload para Cloudinary
//         if (req.files?.photo) {
//             const photo = req.files.photo;
            
           
//             if (!photo.mimetype.startsWith('image/')) {
//                 return res.status(400).json({ error: 'Arquivo não é uma imagem válida' });
//             }


//             const uploadOptions = {
//                 folder: 'users',
//                 public_id: `user_${userId}`,
//                 tags: [`${name}_${userId}`],
//                 resource_type: 'auto',
//                 timeout: 80000 
//             };

//             const uploadResult = await cloudinary.uploader.upload(
//                 photo.tempFilePath, 
//                 uploadOptions
//             );

//             console.log('Upload realizado com sucesso:', uploadResult);
//         }

//         // 4. Resposta final
//         res.json({ 
//             success: true,
//             message: 'Usuário registrado com foto'
//         });

//     } catch (error) {
//         console.error('Erro no registro:', error);
//         res.status(500).json({ 
//             error: 'Erro no processamento',
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
