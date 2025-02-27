const sqlite3 = require('sqlite3').verbose()
const path = require('path')

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'todos.db'))
    this.init()
  }

  init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  getAllTodos() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }

  addTodo(title) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO todos (title) VALUES (?)', [title], function(err) {
        if (err) reject(err)
        resolve(this.lastID)
      })
    })
  }

  toggleTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE todos SET completed = NOT completed WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}

module.exports = new Database()