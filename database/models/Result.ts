import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Result extends Model<ResultAttributes> {
  static defineModel(sequelize: Sequelize) {
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