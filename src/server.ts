import express, { Express, NextFunction, Router, Request, Response } from "express";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

let _token : string | undefined = process.env.JWT_SECRET;
if (!_token || _token.length < 16) {
    throw new Error("JWT Secret is not set or doesn't meet the minimum length requirement, check .env file");
};
_token = undefined;

let server : Express = express();
const PORT : string = process.env.PORT || "8081";
server.use(bodyParser.urlencoded());
server.use(bodyParser.json());
server.use(cookieParser());

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    console.error(err);
    
    res.send({ errors: [`${err.message}`] });
};

server.use(routes);
server.use(errorHandler);


server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}...`);

})
.on("error", function (error) {
    console.log(`Server closing, reason: ${error.message}`);
})

