const fs = require("fs")
const path = require("path")
const { Low } = require("lowdb")
const { JSONFile } = require("lowdb/node")
const mongoose = require("mongoose")
const config = require("../config")

async function connectDB() {
  if (config.MONGODB_URL) {
    try {
      await mongoose.connect(config.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      global.dbType = "mongo"
      return { type: "mongo" }
    } catch (err) {
      console.error("MongoDB connection failed:", err.message)
    }
  }

  const dbPath = path.join(__dirname, "json_database")
  if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)

  global.dbType = "json"
  global.db = async (name) => {
    const file = path.join(dbPath, `${name}.json`)
    const adapter = new JSONFile(file)
    const db = new Low(adapter, { id: name, enabled: false })

    await db.read()
    await db.write()

    return db
  }

  return { type: "json", use: global.db }
}

module.exports = connectDB
