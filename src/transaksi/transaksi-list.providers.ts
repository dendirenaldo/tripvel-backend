import { TransaksiList } from './transaksi-list.entity';

export const TransaksiListProviders = [
  {
    provide: 'TRANSAKSI_LIST_REPOSITORY',
    useValue: TransaksiList,
  },
];