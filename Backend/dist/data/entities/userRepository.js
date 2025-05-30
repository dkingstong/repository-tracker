"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// user-repository.entity.ts
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const repository_1 = require("./repository");
let UserRepository = class UserRepository {
};
exports.UserRepository = UserRepository;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserRepository.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserRepository.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserRepository.prototype, "repositoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserRepository.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.userRepositories, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_1.User)
], UserRepository.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => repository_1.Repository, repo => repo.userRepositories, { onDelete: 'CASCADE' }),
    __metadata("design:type", repository_1.Repository)
], UserRepository.prototype, "repository", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserRepository.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserRepository.prototype, "updatedAt", void 0);
exports.UserRepository = UserRepository = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_repository' })
], UserRepository);
