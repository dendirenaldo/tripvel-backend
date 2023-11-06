import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Auth } from 'src/auth/auth.entity';
import { ChangePasswordDto, ChangeProfileDto, InsertAccountDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { Travel } from 'src/travel/travel.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RoleType } from 'src/general/role.type';
import { QueryAccountDto } from './dto/query-account.dto';
import { FindAllAccountInterface } from './interface';
import * as fs from 'fs';

@Injectable()
export class AccountService {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private authRepository: typeof Auth,

        private config: ConfigService,

        private mailService: MailService

    ) { }

    async findAll(query: QueryAccountDto, user: any): Promise<FindAllAccountInterface> {
        const account = await this.authRepository.findAll({
            include: [{
                model: Travel,
                as: 'travel',
                attributes: ['id', 'nama']
            }],
            ...(query?.offset && { offset: query?.offset }),
            ...(query?.limit && { limit: query?.limit }),
            ...(query.order ? {
                order: [[Array.isArray(query.order.index) ? Sequelize.col(query.order.index.join('.')) : query.order.index, query.order.order]]
            } : {
                order: [['createdAt', 'DESC']]
            }),
            where: {
                ...(user.role === RoleType.Travel && {
                    ...((query.filterRole !== undefined && (query.filterRole !== 'Admin' && query.filterRole !== 'Pelanggan')) ? {
                        role: query.filterRole
                    } : {
                        role: {
                            [Op.in]: [RoleType.Travel, RoleType.Supir]
                        }
                    }),
                    travelId: user.travelId,
                }),
                ...((query.filterRole && user.role === RoleType.Admin) && {
                    role: query.filterRole
                }),
                ...(query.search && {
                    [Op.or]: [{
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        email: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        jenisKelamin: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        role: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        latitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        longitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        '$travel.nama$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                }),
            }
        })
        const jumlahData = await this.authRepository.count({
            include: [{
                model: Travel,
                as: 'travel',
                attributes: ['id', 'nama']
            }],
            where: {
                ...(user.role === RoleType.Travel && {
                    ...((query.filterRole !== undefined && (query.filterRole !== 'Admin' && query.filterRole !== 'Pelanggan')) ? {
                        role: query.filterRole
                    } : {
                        role: {
                            [Op.in]: [RoleType.Travel, RoleType.Supir]
                        }
                    }),
                    travelId: user.travelId,
                }),
                ...((query.filterRole && user.role === RoleType.Admin) && {
                    role: query.filterRole
                }),
                ...(query.search && {
                    [Op.or]: [{
                        namaLengkap: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        email: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        jenisKelamin: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        role: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        latitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        longitude: {
                            [Op.like]: `%${query.search}%`
                        }
                    }, {
                        '$travel.nama$': {
                            [Op.like]: `%${query.search}%`
                        }
                    }]
                })
            }
        })
        return {
            data: account,
            totalData: jumlahData,
            totalRow: account.length
        }
    }

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

    async findOne(userId: number, user: any): Promise<Auth> {
        return this.authRepository.findOne({
            where: {
                id: userId,
                ...(user.role === 'Travel' && {
                    travelId: user.travelId,
                    role: {
                        [Op.in]: [RoleType.Travel, RoleType.Supir]
                    }
                })
            },
            attributes: {
                exclude: ['password']
            },
        })
    }

    async emailVerification(user: any) {
        return await this.mailService.sendEmailConfirmation(user.email);
    }

    async create(data: InsertAccountDto, filename: Express.Multer.File['filename']) {
        const { gambar, ...filteredData } = data;
        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = bcrypt.hashSync(data?.password ? data.password : '12345678', salt)
        if ((data.role === RoleType.Travel || data.role === RoleType.Supir) && !data.travelId) throw new BadRequestException({
            statusCode: 400,
            travelId: 'travelId shouldn\'t be empty',
            error: 'Bad Request',
        })

        try {
            const user: Auth = await this.authRepository.create({
                ...filteredData,
                password: password_hash,
                ...(filename && { gambar: filename })
            })
            delete user.password
            return user
        } catch (err) {
            const errors = err.errors.map((val) => ({
                [val.path]: val.message
            }));

            if (err.name === 'SequelizeUniqueConstraintError') throw new BadRequestException({
                statusCode: 400,
                ...errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                error: 'Bad Request',
            })
        }
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

    async update(id: number, data: InsertAccountDto, filename?: Express.Multer.File['filename']) {
        const { gambar, ...filteredData } = data;
        const user = await this.authRepository.findByPk(id);
        if (!user) throw new UnprocessableEntityException('User not found');
        if ((data.role === RoleType.Travel || data.role === RoleType.Supir) && !data.travelId) throw new BadRequestException({
            statusCode: 400,
            travelId: 'travelId shouldn\'t be empty',
            error: 'Bad Request',
        })
        const salt = bcrypt.genSaltSync(+this.config.get<number>('SALT_ROUND'));
        const password_hash = data?.password ? bcrypt.hashSync(data.password, salt) : user.password

        try {
            if (user.gambar !== 'default.png' && filename) {
                if (fs.existsSync(`uploads/foto-profil/${user.gambar}`)) {
                    fs.unlinkSync(`uploads/foto-profil/${user.gambar}`);
                }
            }
            const userUpdated: Auth = await this.authRepository.update({
                ...filteredData,
                password: password_hash,
            }, { where: { id } }).then(async () => await this.authRepository.findByPk(id))
            delete userUpdated.password;
            return user;
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                const errors = err.errors.map((val) => ({
                    [val.path]: val.message
                }));
                throw new BadRequestException({
                    statusCode: 400,
                    ...errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                    error: 'Bad Request',
                })
            } else if (err?.response) {
                throw new BadRequestException(err.response)
            } else {
                console.error(err);
            }
        }
    }
}
