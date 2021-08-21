import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Result extends Model<StatisticsAttributes> {
  /**
   * This function is used to define a model in the database connected to the
   * sequelize instance passed as an argument.
   * 
   * @param {Sequelize} sequelize A sequelize instance.
   */
  static defineModel(sequelize: Sequelize): void {
    this.init({
      testId: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      mean: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      count: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      p25: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      p50: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      p75: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      min: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      max: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      stddev: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
    }, {
      sequelize
    })
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
}