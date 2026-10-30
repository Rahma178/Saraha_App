import { config } from "dotenv";
import { resolve } from "node:path"

const NODE_ENV = process.env.NODE_ENV // development || production

const envPath = {
    development: ".env.development",
    production: ".env.production",
}

config({ path: resolve(`config/${envPath[NODE_ENV]}`) })

export const PORT = +process.env.PORT
export const DB_URI = process.env.DB_URI
export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS.split(",")
export const REDIS_URL = process.env.REDIS_URL
export const ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE
export const REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE
export const ENCRYPTION_KEYW = process.env.ENCRYPTION_KEYW
export const EMAIL = process.env.EMAIL
export const PASSWORD = process.env.PASSWORD
export const AUDIANCE_GMAIL = process.env.AUDIANCE_GMAIL