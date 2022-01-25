import { hash } from 'bcrypt'
import { prisma } from '../../../../database/prismaClient'

interface ICreateClient {
  username: string
  password: string
}
export class CreateClientUseCase {
  async execute({ password, username }: ICreateClient) {
    // Validar se o client existe
    const clientExist = await prisma.clients.findFirst({
      where: {
        username: {
          mode: 'insensitive',
        },
      },
    })

    if (clientExist) {
      throw new Error('Client already exists')
    }
    // Criptografar a senha
    const hashPassword = await hash(password, 10)
    const client = await prisma.clients.create({
      data: {
        username,
        password: hashPassword,
      },
    })

    // Salvar o cliente
    return client
  }
}
