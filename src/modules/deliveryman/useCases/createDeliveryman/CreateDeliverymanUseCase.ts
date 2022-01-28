import { hash } from 'bcrypt'
import { prisma } from '../../../../database/prismaClient'

interface ICreateDeliveryman {
  username: string
  password: string
}
export class CreateDeliverymanUseCase {
  async execute({ password, username }: ICreateDeliveryman) {
    const deliverymanExist = await prisma.deliveryman.findFirst({
      where: {
        username: {
          mode: 'insensitive',
        },
      },
    })

    if (deliverymanExist) {
      throw new Error('Deliveryman already exists')
    }
    // Criptografar a senha
    const hashPassword = await hash(password, 10)
    // Salvar o deliveryman
    const deliveryman = await prisma.deliveryman.create({
      data: {
        username,
        password: hashPassword,
      },
    })
    return deliveryman
  }
}
