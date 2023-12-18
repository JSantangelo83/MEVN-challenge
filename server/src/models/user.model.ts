import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isAdmin!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}

export default User;
