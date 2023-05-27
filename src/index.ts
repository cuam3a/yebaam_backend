import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { router } from "./routers";
import { connectDB } from "./config/database";

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
app.use(cors());
app.use(express.json()); 
app.use(router);

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: "Hola" });
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default server;