import { DataTypes, Model, Sequelize } from 'sequelize';

export default class Result
  extends Model<ResultAttributes>
  implements ResultAttributes
{
  public scannedOn!: Date;
  public studentNumber!: string;
  public testId!: string;
  public firstName!: string;
  public lastName!: string;
  public availableMarks!: number;
  public obtainedMarks!: number;
  public percentageMark!: number;

  /**
   * This function is used to define a model in the database connected to the
   * sequelize instance passed as an argument.
   *
   * @param {Sequelize} sequelize A sequelize instance.
   */
  static defineModel(sequelize: Sequelize): void {
    this.init(
      {
        scannedOn: {
          allowNull: false,
          type: DataTypes.DATE,
          validate: {
            isDate: true,
          },
        },
        studentNumber: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        testId: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        firstName: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        lastName: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        availableMarks: {
          allowNull: false,
          type: DataTypes.INTEGER,
          validate: {
            min: 0,
          },
        },
        obtainedMarks: {
          allowNull: false,
          type: DataTypes.INTEGER,
          validate: {
            min: 0,
          },
        },
        percentageMark: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            min: 0,
            max: 100,
          },
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
export interface ResultAttributes {
  scannedOn: Date;
  studentNumber: string;
  testId: string;
  firstName: string;
  lastName: string;
  availableMarks: number;
  obtainedMarks: number;
  percentageMark: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
