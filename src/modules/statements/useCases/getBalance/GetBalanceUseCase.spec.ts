import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let statementsRepository: IStatementsRepository
let usersRepository: IUsersRepository

describe('Get Balance', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it('should be able to get a user balance', async () => {
    const user = await usersRepository.create({
      name: 'user',
      email: 'user@system.com',
      password: '123456'
    })

    const response = await getBalanceUseCase.execute({user_id: user.id as string});

    expect(response).toHaveProperty('statement')
    expect(response).toHaveProperty('balance')
  })

  it('should not be able to get the balance of a nonexisting user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'wrong id'})
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
