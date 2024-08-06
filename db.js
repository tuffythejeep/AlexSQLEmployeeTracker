const { Client } = require("pg");

class Database {
  constructor() {
    this.client = new Client({
    });
  }

  async connect() {
    await this.client.connect();
  }

  async query(text, params) {
    const res = await this.client.query(text, params);
    return res.rows;
  }

}

module.exports = Database;
