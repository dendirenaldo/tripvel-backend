
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { ResetPassword } from 'src/auth/reset-password.entity';
import { BankAccount } from 'src/bank-account/bank-account.entity';
import { Bantuan } from 'src/bantuan/bantuan.entity';
import { Berita } from 'src/berita/berita.entity';
import { Jadwal } from 'src/jadwal/jadwal.entity';
import { Kategori } from 'src/kategori/kategori.entity';
import { Konfigurasi } from 'src/konfigurasi/konfigurasi.entity';
import { KursiTerisi } from 'src/kursi-terisi/kursi-terisi.entity';
import { Mobil } from 'src/mobil/mobil.entity';
import { PromoList } from 'src/promo/promo-list.entity';
import { Promo } from 'src/promo/promo.entity';
import { TransaksiList } from 'src/transaksi/transaksi-list.entity';
import { Transaksi } from 'src/transaksi/transaksi.entity';
import { Travel } from 'src/travel/travel.entity';
import { Tujuan } from 'src/tujuan/tujuan.entity';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize: Sequelize = new Sequelize({
                dialect: 'mysql',
                host: configService.get<string>('DATABASE_HOST', 'localhost'),
                port: configService.get<number>('DATABASE_PORT', 3306),
                username: configService.get<string>('DATABASE_USERNAME', 'root'),
                password: configService.get<string>('DATABASE_PASSWORD', ''),
                database: configService.get<string>('DATABASE_NAME', 'project_calegmu'),
                logging: false,
                timezone: 'Asia/Jakarta',
                dialectOptions: {
                    timezone: 'local',
                    typeCast: function (field, next) {
                        if (field.type === 'DATETIME' || field.type === 'DATE' || field.type === 'TIMESTAMP') {
                            const offset = new Date().getTimezoneOffset() * 60000;
                            return new Date(new Date(field.string()).getTime() - offset);
                        }

                        return next();
                    },
                },
            });
            sequelize.addModels([Auth, ResetPassword, Kategori, Berita, Bantuan, Konfigurasi, Travel, Tujuan, Promo, PromoList, Mobil, Jadwal, BankAccount, Transaksi, TransaksiList, KursiTerisi]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
