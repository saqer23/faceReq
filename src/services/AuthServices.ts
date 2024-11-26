import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { generateToken, verifyPassword } from "../passport-config";

export class AuthService {
  static login(
    req: Request<
      import("express-serve-static-core").ParamsDictionary,
      any,
      any,
      import("qs").ParsedQs,
      Record<string, any>
    >,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      passport.authenticate(
        "local",
        { session: false },
        async (err: any, user: any, info: any) => {
          if (err || !user) {
            console.error("Authentication error:", err || info.message);
            return res.status(400).json({
              message: info ? info.message : "Login failed",
              error: err,
              user: user,
            });
          }

          req.login(user, { session: false }, async (err) => {
            if (err) {
              console.error("Login error:", err);
              return res.status(500).json({ message: "Login failed" });
            }

            try {
              const auth = await prisma.user.findFirst({
                where: { username: user.username },
                
              });

              if (!auth) {
                return res.status(404).json({ message: "User not found." });
              }
              const password = req.body.password;
              const isPasswordCorrect = await verifyPassword(
                password,
                auth.password
              );

              if (isPasswordCorrect) {
                const token = generateToken(user);

                return res.json({
                  user: {
                    id: auth.id,
                    username: auth.username,
                  },
                  token,
                });
              } else {
                return res.status(400).json({ message: "Incorrect password" });
              }
            } catch (error) {
              console.error("Database error:", error);
              return res.status(500).json({ message: "Internal server error" });
            }
          });
        }
      )(req, res);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error creating new Activity.", error);
    }
  }
}

export default new AuthService();
