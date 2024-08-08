import { NextFunction, Request, Response } from "express"

const rateLimitStore = new Map();
const MAX_REQUESTS = 4;
const TIME_WINDOW_MINUTES = 1;
export const rateLimiter = (req: Request, res: Response, next: NextFunction)=>{
    const ip = req.ip;

    const currentTime = Date.now();

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }
    const requestTimestamps = rateLimitStore.get(ip);
    const lastWindowStartTime = currentTime - TIME_WINDOW_MINUTES * 60 * 1000;

    rateLimitStore.set(ip, requestTimestamps);
    const requestsInLastWindow = requestTimestamps.filter(
        (timestamp: number) => timestamp >= lastWindowStartTime
    );
    if(requestsInLastWindow.length >= MAX_REQUESTS){
        res.json({
            msg: "Too many requests. Please try again later." + (MAX_REQUESTS - requestsInLastWindow.length)
        })
    }
    else{
        requestTimestamps.push(currentTime);
        rateLimitStore.set(ip, requestTimestamps);
        res.locals.msg = "Accepted. " + (MAX_REQUESTS - requestsInLastWindow.length) + " requests remaining";
        next();
    }

}