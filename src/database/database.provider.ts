
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { ResetPassword } from 'src/auth/reset-password.entity';
import { Bantuan } from 'src/bantuan/bantuan.entity';
import { Berita } from 'src/berita/berita.entity';
import { Kategori } from 'src/kategori/kategori.entity';
// import { Isu } from 'src/isu/isu.entity';
import { Konfigurasi } from 'src/konfigurasi/konfigurasi.entity';
import { Mobil } from 'src/mobil/mobil.entity';
import { PromoList } from 'src/promo/promo-list.entity';
import { Promo } from 'src/promo/promo.entity';
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
                dialectOptions: {
                    useUTC: false,
                    timezone: 'local'
                },
                timezone: 'Asia/Jakarta'
            });
            sequelize.addModels([Auth, ResetPassword, Kategori, Berita, Bantuan, Konfigurasi, Travel, Tujuan, Promo, PromoList, Mobil]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
