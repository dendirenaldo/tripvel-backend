import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Auth } from 'src/auth/auth.entity';
import { ChangePasswordDto, ChangeProfileDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { Travel } from 'src/travel/travel.entity';

@Injectable()
export class AccountService {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,

        private config: ConfigService,

        private mailService: MailService

    ) { }

    async me(userId: number) {
        return await this.authRepository.findByPk(userId, {
            include: [{
                model: Travel,
                as: 'travel',
                required: false
            }]
        })
    }

    async emailVerificationAction(token: number) {
        const account: Auth = await this.authRepository.findOne({ where: { verificationCode: token } });

        if (!account) throw new UnprocessableEntityException('Account not found')

        await this.authRepository.update({
            verificationCode: null,
            isActive: true
        }, { where: { id: account.id } })

        return {
            statusCode: 201,
            message: 'Your account is activated. Now you can login with your own account!'
        }
    }

    async findUser(userId: number): Promise<Auth> {
        return this.authRepository.findByPk(userId, {
            attributes: ['id', 'namaLengkap', 'email', 'gambar', 'role']
        })
    }

    async emailVerification(user: any) {
        return await this.mailService.sendEmailConfirmation(user.email);
    }

    async changeProfile(data: ChangeProfileDto, userId: number) {
        return await this.authRepository.update({ ...data }, { where: { id: userId } }).then(async () => await this.authRepository.findByPk(userId));
    }

    async changePhotoProfile(gambar: Express.Multer.File['filename'], userId: number) {
        return await this.authRepository.update({ gambar }, { where: { id: userId } }).then(async () => await this.authRepository.findByPk(userId));
    }

    async changePassword(data: ChangePasswordDto, userId: number) {
        if (data.passwordBaru != data.konfirmasiPasswordBaru) throw new BadRequestException({
            statusCode: 400,
            konfirmasiPasswordBaru: 'konfirmasiPasswordBaru must match with passwordBaru',
            error: 'Bad Request'
        })

        const userData = await this.authRepository.findByPk(userId)

        if (!(await bcrypt.compare(data.passwordLama, userData.password))) throw new BadRequestException({
            statusCode: 400,
            passwordLama: 'passwordLama is invalid',
            error: 'Bad Request'
        })

        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = bcrypt.hashSync(data.passwordBaru, salt);
        return await this.authRepository.update({ password: password_hash }, { where: { id: userId } }).then(() => userData);
    }
}
