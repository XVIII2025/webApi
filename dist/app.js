"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const movie_1 = require("./api/movie");
const person_1 = require("./api/person");
const stars_1 = require("./api/stars");
const creator_1 = require("./api/creator");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: "*" //เรียกได้ทุกเว็บ
}));
exports.app.use(body_parser_1.default.text());
exports.app.use(body_parser_1.default.json());
exports.app.use("/movie", movie_1.router);
exports.app.use("/person", person_1.router);
exports.app.use("/stars", stars_1.router);
exports.app.use("/creators", creator_1.router);
exports.app.use("/", (req, res) => {
    res.send("Hello World!!!");
});
