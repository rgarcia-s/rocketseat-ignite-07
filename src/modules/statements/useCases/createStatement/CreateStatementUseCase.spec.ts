import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

import { OperationType, Statement } from '../../entities/Statement'
import { CreateStatementError } from "./CreateStatementError"

let createStatementUseCase: CreateStatementUseCase
let statementsRepository: IStatementsRepository
let usersRepository: IUsersRepository

describe('Create Statement', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it('should be able to create a statement', async () => {
    const user = await usersRepository.create({
      name: 'user',
      email: 'user@system.com',
      password: '123456'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit'
    })

    expect(statement).toBeInstanceOf(Statement);
    expect(statement).toHaveProperty('id');
  })

  it('should not be able to create a withdraw statement greater than the balance', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'user',
        email: 'user@system.com',
        password: '123456'
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 10,
        description: 'withdraw'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })

  it('should not be able to create statement to a nonexistent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'wrong id',
        type: OperationType.DEPOSIT,
        amount: 10,
        description: 'deposit'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })
})
