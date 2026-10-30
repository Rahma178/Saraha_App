import { REDIS_URL } from "../../../config/config.service.js";

import { createClient } from "redis"

export const redis_client = createClient({
    url: REDIS_URL
});

export default async function connectionRedis() {
    try {
        await redis_client.connect();
        console.log("Redis Connected Successfully.......😉");
    } catch (error) {
        console.log("Redis Connected Failed......😜😉");
    }
}