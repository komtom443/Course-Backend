import { DataSource, DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: process.env.DATABASE_HOST,
//   port: parseInt(process.env.DATABASE_PORT),
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   entities: ['src/entites/*.{ts,js}'],
//   synchronize: true,
// };
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3360,
  username: 'root',
  password: '12345',
  database: 'course',
  entities: ['dist/src/entities/*.entity.js'],
  synchronize: true,
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
