import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Result extends Model<ResultAttributes> {
  /**
   * This function is used to define a model in the database connected to the
   * sequelize instance passed as an argument.
   * 
   * @param {Sequelize} sequelize A sequelize instance.
   */
  static defineModel(sequelize: Sequelize): void {
    this.init({
      scannedOn: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      studentNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      testId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      availableMarks: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      obtainedMarks: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      percentageMark: {
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
interface ResultAttributes {
  scannedOn: Date;
  studentNumber: string;
  testId: string;
  firstName: string;
  lastName: string;
  availableMarks: number;
  obtainedMarks: number;
  percentageMark: number;
}