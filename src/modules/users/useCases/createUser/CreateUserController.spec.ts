import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'user@email.com',
      password: '123456',
    }).expect(201)
  })

  it('should not be able to create a user with an already used email', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user2',
      email: 'user@email.com',
      password: '123456',
    }).expect(400)
  })
})
