import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType, Statement } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let statementsRepository: IStatementsRepository
let usersRepository: IUsersRepository

describe('Get Statement Operation', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it('should be able to get a statement operation', async () => {
    const user = await usersRepository.create({
      name: 'user',
      email: 'user@system.com',
      password: '123456'
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      amount: 10,
      description: 'deposit',
      type: OperationType.DEPOSIT
    })

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(response).toBeInstanceOf(Statement)
  })

  it('should not be able to get a statement operation from a non existing user', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'user',
        email: 'user@system.com',
        password: '123456'
      });

      const statement = await statementsRepository.create({
        user_id: user.id as string,
        amount: 10,
        description: 'deposit',
        type: OperationType.DEPOSIT
      })

      await getStatementOperationUseCase.execute({
        user_id: 'wrong id',
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get a statement non existing operation', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'user',
        email: 'user@system.com',
        password: '123456'
      });

      await statementsRepository.create({
        user_id: user.id as string,
        amount: 10,
        description: 'deposit',
        type: OperationType.DEPOSIT
      })

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'wrong id'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
