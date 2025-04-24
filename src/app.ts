import express,{ Application } from "express";
import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("hello world")
})

app.use('/', router)

export default app;