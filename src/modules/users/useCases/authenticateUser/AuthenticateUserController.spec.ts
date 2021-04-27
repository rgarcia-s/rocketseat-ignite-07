import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to authenticate a user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'user@email.com',
      password: '123456',
    })

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'user@email.com',
      password: '123456'
    }).expect(200)

    expect(response.body).toHaveProperty('token')
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    await request(app).post('/api/v1/sessions').send({
      email: 'wrong@email.com',
      password: '123456'
    }).expect(401)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    await request(app).post('/api/v1/sessions').send({
      email: 'wrong@email.com',
      password: '123456'
    }).expect(401)
  })
})
