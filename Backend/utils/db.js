import mysql from 'mysql2';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const con = mysql.createConnection({
    host: 'b689gmshx1agzwefaeic-mysql.services.clever-cloud.com', 
    user: 'uey9hh3tebppi5te',
    password: 'SA9pwuFPP9QoNalVWuFn',
    database: 'b689gmshx1agzwefaeic',
    port: 3306 
  });

  con.connect((err) => {
    if (err) {
        console.log("❌ Conexión errónea:", err);
    } else {
        console.log("✅ Conexión exitosa a la base de datos");
    }
});


// Transportador de correo 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contacto.coneycloud@gmail.com',
        pass: 'zykbnfqrpfiazzli' 
    }
});

cron.schedule('0 0 * * *', () => {
    console.log("Ejecutando cronjob... Enviando correos a los usuarios...");
    
    con.query("SELECT * FROM vista_gastos_a_vencer", (err, results) => {
        if (err) {
            return console.error("Error consultando la vista:", err);
        }

        results.forEach((usuario) => {
            const mailOptions = {
                from: '"Tu App Financiera Kash" <contacto.coneycloud@gmail.com>', 
                to: usuario.correo,
                subject: '¡Tienes un gasto próximo a vencer!',
                html: `
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f7f6;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            h2 {
                                color: #4CAF50;
                                text-align: center;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.5;
                            }
                            ul {
                                list-style-type: none;
                                padding: 0;
                            }
                            li {
                                margin-bottom: 10px;
                                font-size: 15px;
                            }
                            .strong-text {
                                font-weight: bold;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                font-size: 12px;
                                color: #777;
                            }
                            .btn {
                                display: inline-block;
                                background-color: #4CAF50;
                                color: #fff;
                                padding: 10px 20px;
                                border-radius: 5px;
                                text-decoration: none;
                                margin-top: 20px;
                            }
                            .btn:hover {
                                background-color: #45a049;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Hola ${usuario.usuario},</h2>
                            <p>Este es un recordatorio de que tienes una suscripción próxima a vencer:</p>
                            <ul>
                                <li><span class="strong-text">Gasto:</span> ${usuario.gasto}</li>
                                <li><span class="strong-text">Monto:</span> $${usuario.monto_a_pagar}</li>
                                <li><span class="strong-text">Fecha de vencimiento:</span> ${new Date(usuario.fecha_vencimiento).toLocaleDateString()}</li>
                            </ul>
                            <p>Te recomendamos tomar las acciones necesarias para evitar contratiempos.</p>
                            <a href="https://hostingv-1.vercel.app/" class="btn">Ir a mi cuenta</a>
                            <p class="footer">Saludos,<br>Tu equipo financiero Kash</p>
                        </div>
                    </body>
                    </html>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.error(`Error enviando correo a ${usuario.correo}:`, error);
                }
                console.log(`Correo enviado a ${usuario.correo}: ${info.response}`);
            });
        });
    });
});


export default con;
