import http from "node:http";
import { app } from "./app";

export const server = http.createServer(app);
