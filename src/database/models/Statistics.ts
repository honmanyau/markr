import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Statistics
  extends Model<StatisticsAttributes>
  implements StatisticsAttributes
{
  public testId!: string;
  public mean!: number;
  public count!: number;
  public p25!: number;
  public p50!: number;
  public p75!: number;
  public min!: number;
  public max!: number;
  public stddev!: number;

  /**
   * This function is used to define a model in the database connected to the
   * sequelize instance passed as an argument.
   *
   * @param {Sequelize} sequelize A sequelize instance.
   */
  static defineModel(sequelize: Sequelize): void {
    this.init(
      {
        testId: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        mean: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            min: 0,
            max: 100,
          },
        },
        count: {
          allowNull: false,
          type: DataTypes.FLOAT,
        },
        p25: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            min: 0,
            max: 100,
          },
        },
        p50: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            min: 0,
            max: 100,
          },
        },
        p75: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            min: 0,
            max: 100,
          },
        },
        min: {
          allowNull: false,
          type: DataTypes.INTEGER,
          validate: {
            min: 0,
            max: 100,
          },
        },
        max: {
          allowNull: false,
          type: DataTypes.INTEGER,
          validate: {
            min: 0,
            max: 100,
          },
        },
        stddev: {
          allowNull: false,
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
      }
    );
  }
}

// ===========
// == Types ==
// ===========
interface StatisticsAttributes {
  testId: string;
  mean: number;
  count: number;
  p25: number;
  p50: number;
  p75: number;
  min: number;
  max: number;
  stddev: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
