import express, { Application } from "express";
import cors from "cors";
import "./passport-config";
import rootRouter from "./routes/";
import passport from "passport";
import path from "path";
import bodyParser from "body-parser";
import { prisma } from "./utility/prisma";
import { hashPassword } from "./passport-config";
require("dotenv").config();

class App {
  public app: Application;
  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setPassport();
    this.setRoutes();
    this.setAdmin();
  }

  private setMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    const corsOptions: cors.CorsOptions = {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    this.app.use(cors(corsOptions));

    // Serve static files from the 'uploads' directory
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../face/webcam_face_recognition/faces"))
    );
  }

  private setRoutes(): void {
    // Prefixing the routes with '/api' is a common convention for indicating that this is an API endpoint.
    this.app.use("/api", rootRouter);
  }

  private async setAdmin(): Promise<void> {
    try {
      console.log('here');
      
      const existUser = await prisma.user.findFirst({
        where: { username: "admin" },
      });
      
      if (existUser) {
        console.log("admin already exists");
        return;
      }
      const hashPass = await hashPassword("123456789");
      const user = await prisma.user.create({
        data: {
          username: "admin",
          password: hashPass,
        },
      });
      console.log(user);
      
    } catch (error) {
      console.error(error);
    }
  }
  private setPassport(): void {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
  }

  public listen(): void {
    const PORT = process.env.PORT || 3001;
    this.app.listen(PORT, async () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}
//app
const app = new App();
app.listen();
