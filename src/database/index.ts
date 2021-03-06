import { Sequelize } from 'sequelize';
import { PRODUCTION_DB } from '../../src/config';
import * as models from './models';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'production' ? PRODUCTION_DB : ':memory:',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

for (const [_name, model] of Object.entries(models)) {
  model.defineModel(sequelize);
}

// ===============
// == Functions ==
// ===============
/**
 * This function exports an async function for testing the sequelize instance
 * initialised above. It is intended to be use to ensure a database connection
 * is available before starting the Node.js server.
 */
export async function init(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Successfully established connection to the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

/**
 * This function closes the database connection. It is a convenience function
 * meant to be used in tests.
 */
export async function close(): Promise<void> {
  return sequelize.close();
}
