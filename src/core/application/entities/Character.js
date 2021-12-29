"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Character = void 0;
var typeorm_1 = require("typeorm");
var GenderType;
(function (GenderType) {
    GenderType["MALE"] = "\uB0A8\uC790";
    GenderType["FEMALE"] = "\uC5EC\uC790";
})(GenderType || (GenderType = {}));
var GuardianType;
(function (GuardianType) {
    GuardianType["RED_BIRD"] = "\uC8FC\uC791";
    GuardianType["BLACK_TORTOISE"] = "\uD604\uBB34";
    GuardianType["BLUE_DRAGON"] = "\uCCAD\uB8E1";
    GuardianType["WHITE_TIGER"] = "\uBC31\uD638";
})(GuardianType || (GuardianType = {}));
var Character = /** @class */ (function () {
    function Character() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Character.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Character.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)()
    ], Character.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)()
    ], Character.prototype, "hair");
    __decorate([
        (0, typeorm_1.Column)()
    ], Character.prototype, "face");
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            "enum": GenderType
        })
    ], Character.prototype, "gender");
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            "enum": GuardianType
        })
    ], Character.prototype, "guardian");
    __decorate([
        (0, typeorm_1.Column)()
    ], Character.prototype, "isActive");
    Character = __decorate([
        (0, typeorm_1.Entity)()
    ], Character);
    return Character;
}());
exports.Character = Character;
