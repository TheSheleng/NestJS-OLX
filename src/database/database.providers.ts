import { DataSource } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { User } from 'src/entity/user.entity';
import { Ad } from 'src/entity/ad.entity';
import { AdImage } from 'src/entity/ad-image.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return AppDataSource;
    },
  },
  {
    provide: 'USER_REPOSITORY', 
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'AD_REPOSITORY', 
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Ad),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'AD_IMAGES_REPOSITORY', 
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AdImage),
    inject: ['DATA_SOURCE'],
  },
];
