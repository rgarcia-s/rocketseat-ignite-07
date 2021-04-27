import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let usersRepository: IUsersRepository;


describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'user',
      email: 'user@system.com',
      password: '123456'
    });

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with an already used email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'user',
        email: 'user@system.com',
        password: '123456'
      });
      await createUserUseCase.execute({
        name: 'user2',
        email: 'user@system.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
