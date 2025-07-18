import express, { Express, Router } from "express";
import routes from "./routes/index";
import { JsonWebTokenError } from "jsonwebtoken";

let server : Express = express();
const PORT : string = process.env.PORT || "8081";
server.use(routes);

let _token : string | undefined = process.env.JWT_SECRET;
if (!_token || _token.length < 16) {
    throw new JsonWebTokenError("JWT Secret is not set or doesn't meet the minimum length requirement, check .env file");
};
_token = undefined;

server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}...`);

})
.on("error", function (error) {
    console.log(`Server closing, reason: ${error.message}`);
})

