const mysql = require('mysql2/promise');

async function updateAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'money_track_db'
    });

    const hash = '$2a$10$shUV9frfi1Qb4q5P9BRlEeL7I9hFWQ8m/.f.tlbCiMFIgwaJmFVse';
    await connection.query('UPDATE users SET password = ? WHERE nim = ?', [hash, 'ADMIN001']);
    console.log('Admin password updated successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateAdmin();
