import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepository: IUsersRepository;

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it('should be able to show a user profile', async () => {
    const user = await usersRepository.create({
      name: 'user',
      email: 'user@system.com',
      password: '123456'
    })

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toBeInstanceOf(User)
  })

  it('should not be able to show a profile of a nonexisting user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('wrongId');
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
