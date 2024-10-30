import { Request, Response, NextFunction } from "express"

export function auth(req: Request, res: Response, next: NextFunction) {
  const VALID_API_KEY = process.env.API_KEY
  const apiKey = req.query.api_key || req.headers["x-api-key"]
  if (!apiKey) {
    res.status(401).send("API key is missing")
    return
  }
  if (apiKey !== VALID_API_KEY) {
    res.status(403).send("Invalid API key")
    return
  }
  next()
}
