import express from "express"
import dotenv from "dotenv"
import connectDb from "./database/db.js"
import userRoute from "./routes/user.route.js"
import blogRoute from "./routes/blog.route.js"
import commentRoute from "./routes/comment.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"

dotenv.config()
const app = express()

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://mern-blog-axdb.onrender.com",
    credentials: true
}));

const _dirname = path.resolve()

const PORT = process.env.PORT || 3000

app.use("/api/v1/user", userRoute)
app.use("/api/v1/blog", blogRoute)
app.use("/api/v1/comment", commentRoute)

app.use(express.static(path.join(_dirname, "/frontend/dist")))
// app.get("*", (_, res) => {
//     res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
// })

app.listen(PORT, () => {
    connectDb()
    console.log(`Server listen at port ${PORT}`);
})