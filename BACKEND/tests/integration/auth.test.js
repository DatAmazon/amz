const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/server');
const User = require('../../src/api/models/systems/user');

describe('AUTHENTICATION APIS', async () => {
  let dbUser;
  let user;

  beforeEach(async () => {
    dbUser = {
      username: "nam1812hy",
      name: 'Nam Phạm',
      email: 'nam1812hy@gmail.com',
      password: 'passwordHashed',
      role: 'admin',
      active: true,
      group: { code: '1', name: 'admin' },
    };
    user = {
      username: "nam1812hy2",
      name: 'Nam Phạm 2',
      email: 'nam1812hy2@gmail.com',
      password: 'passwordHashed',
      role: 'admin',
      active: true,
      group: { code: '1', name: 'admin' },
    };
    await User.deleteMany({});
    await User.create(dbUser);
  });

  describe('POST /auth/register', () => {
    it('Should register user', async () => {
      const res = await request(app).post('/api/auth/register').send(user).expect(201);
      delete user.password;
      user.role = 'user';
      expect(res.body.data).to.haveOwnProperty('token');
      expect(res.body.data).to.haveOwnProperty('user');
      expect(res.body.data.user).to.include(user);
    });

    it('Should report error when email already exists', async () => {
      const res = await request(app).post('/api/auth/register').send(dbUser).expect(400);
      const { field, location, messages } = res.body.errors[0];
      expect(res.body.code).to.equal(400);
      expect(res.body.message).to.equal('Email is already in use by another account');
      expect(field).to.be.equal('email');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('Email is already in use');
    });

    it('Should report validation error when fileds are invalid', async () => {
      const invalidData = {
        email: 'she!k.com',
        password: '124',
        name: 's',
      };
      const res = await request(app).post('/api/auth/register').send(invalidData).expect(400);
      const data1 = res.body.errors[0];
      const data2 = res.body.errors[1];
      const data3 = res.body.errors[2];

      expect(res.body.code).to.equal(400);
      expect(res.body.message).to.equal('Validation Error');

      expect(data1.field).to.be.equal('name');
      expect(data1.location).to.be.equal('body');
      expect(data1.messages).to.be.equal('name length must be at least 2 characters long');

      expect(data2.field).to.be.equal('email');
      expect(data2.location).to.be.equal('body');
      expect(data2.messages).to.be.equal('email must be a valid email');

      expect(data3.field).to.be.equal('password');
      expect(data3.location).to.be.equal('body');
      expect(data3.messages).to.be.equal('password length must be at least 6 characters long');
    });

    it('Should report validation error when fields are not passed', async () => {
      const res = await request(app).post('/api/auth/register').send({}).expect(400);
      const data1 = res.body.errors[0];
      const data2 = res.body.errors[1];
      const data3 = res.body.errors[2];

      expect(res.body.code).to.equal(400);
      expect(res.body.message).to.equal('Validation Error');

      expect(data1.field).to.be.equal('name');
      expect(data1.location).to.be.equal('body');
      expect(data1.messages).to.be.equal('name is required');

      expect(data2.field).to.be.equal('email');
      expect(data2.location).to.be.equal('body');
      expect(data2.messages).to.be.equal('email is required');

      expect(data3.field).to.be.equal('password');
      expect(data3.location).to.be.equal('body');
      expect(data3.messages).to.be.equal('password is required');
    });
  });

  describe('POST /auth/login', () => {
    it('Should return access and refresh token if valid credentials provided', async () => {
      const res = await request(app).post('/api/auth/login').send(dbUser).expect(200);

      expect(res.body.data.user).to.haveOwnProperty('id');

      delete res.body.data.user.id;
      delete dbUser.password;

      expect(res.body.data.user).to.include(dbUser);
      expect(res.body.data.tokens).to.haveOwnProperty('accessToken');
      expect(res.body.data.tokens).to.haveOwnProperty('refreshToken');
      expect(res.body.data.tokens).to.haveOwnProperty('tokenType');
    });

    it('Should report required parameter error when data not provided', async () => {
      const res = await request(app).post('/api/auth/login').send({}).expect(400);
      const data2 = res.body.errors[0];
      const data3 = res.body.errors[1];

      expect(res.body.code).to.equal(400);
      expect(res.body.message).to.equal('Validation Error');

      expect(data2.field).to.be.equal('email');
      expect(data2.location).to.be.equal('body');
      expect(data2.messages).to.be.equal('email is required');

      expect(data3.field).to.be.equal('password');
      expect(data3.location).to.be.equal('body');
      expect(data3.messages).to.be.equal('password is required');
    });

    it('Should report error when data not provided is invalid', async () => {
      const invalidData = {
        email: 'she@!!sdj.c',
        password: 'ad',
      };

      const res = await request(app).post('/api/auth/login').send(invalidData).expect(400);
      const data2 = res.body.errors[0];
      const data3 = res.body.errors[1];

      expect(res.body.code).to.equal(400);
      expect(res.body.message).to.equal('Validation Error');

      expect(data2.field).to.be.equal('email');
      expect(data2.location).to.be.equal('body');
      expect(data2.messages).to.be.equal('email must be a valid email');

      expect(data3.field).to.be.equal('password');
      expect(data3.location).to.be.equal('body');
      expect(data3.messages).to.be.equal('password length must be at least 6 characters long');
    });

    it('Should report invalid credential error', async () => {
      const invalidData = {
        email: 'branstark12@gmail.com',
        password: 'invalidPassword',
      };
      const res = await request(app).post('/api/auth/login').send(invalidData).expect(401);
      expect(res.body.message).to.equal('Invalid Credentials, Please check and try again');
      expect(res.body.code).to.equal(401);
      expect(res.body.errors).to.be.lengthOf(0);
    });
  });
});
