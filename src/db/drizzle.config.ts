import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost) {
  console.warn("SQL_HOST is not set yet; Drizzle Kit will require it during migrations.");
}
if (!sqlDbName) {
  console.warn("SQL_DB_NAME is not set yet; Drizzle Kit will require it during migrations.");
}
if (!user) {
  console.warn("SQL_ADMIN_USER is not set yet; Drizzle Kit will require it during migrations.");
}
if (!password) {
  console.warn("SQL_ADMIN_PASSWORD is not set yet; Drizzle Kit will require it during migrations.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost || "localhost",
    user: user || "postgres",
    password: password || "",
    database: sqlDbName || "postgres",
    ssl: false,
  },
  verbose: true,
});
