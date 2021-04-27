import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate a user', async () => {
    const passwordHash = await hash('123456', 8);

    await usersRepository.create({
      name: 'user',
      email: 'user@system.com',
      password: passwordHash
    })

    const response = await authenticateUserUseCase.execute({
      email: 'user@system.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')
  })

  it('should not be able to authenticate a user with a wrong email', async () => {
    expect(async () => {
      const passwordHash = await hash('123456', 8);

      await usersRepository.create({
        name: 'user',
        email: 'user@system.com',
        password: passwordHash
      })

      await authenticateUserUseCase.execute({
        email: 'wronguser@system.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate a user with a wrong password', async () => {
    expect(async () => {
      await usersRepository.create({
        name: 'user',
        email: 'user@system.com',
        password: '123456'
      })

      const response = await authenticateUserUseCase.execute({
        email: 'user@system.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
