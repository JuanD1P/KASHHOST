import mysql from 'mysql';

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

export default con;
