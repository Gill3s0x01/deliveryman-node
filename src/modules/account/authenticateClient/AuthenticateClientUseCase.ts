import { prisma } from '../../../database/prismaClient'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

interface IAuthenticateClient {
  username: string
  password: string
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    // Receber username e password
    // Verificar se username cadastrado
    const client = await prisma.clients.findFirst({
      where: {
        username,
      },
    })

    if (!client) {
      throw new Error('Client invalid!')
    }
    // Verificar se password está correta ao username selecionado
    const passwordMatch = await compare(password, client.password)

    if (!passwordMatch) {
      throw new Error('Password invalid!')
    }
    // Gerar o token
    const token = sign({ username }, '17403yhdfmd9083n9jfd3d3re0', {
      subject: client?.id,
      expiresIn: '1d',
    })
    return token
  }
}
