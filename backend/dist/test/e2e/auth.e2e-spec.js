"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../../src/app.module");
describe('AuthController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/auth/register (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'test@example.com',
            password: 'Password123!',
            firstName: 'Test',
            lastName: 'User',
        })
            .expect(201);
    });
    it('/auth/login (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'test@example.com',
            password: 'Password123!',
        })
            .expect(200)
            .expect((res) => {
            expect(res.body.access_token).toBeDefined();
        });
    });
    afterAll(async () => {
        await app.close();
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map