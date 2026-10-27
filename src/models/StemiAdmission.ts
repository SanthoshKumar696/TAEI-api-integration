import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'stemi_admission', timestamps: false })
  export class StemiAdmission extends Model<StemiAdmission> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.INTEGER)
    triage_id!: number;
  
    @Column(DataType.BOOLEAN)
    is_admitted!: boolean;
  
    @Column(DataType.DATE)
    date_time_entry!: Date;
  
    @Column(DataType.STRING(200))
    department_name!: string;
  
    @Column(DataType.DATE)
    date_time_admission!: Date;

    @Column(DataType.BOOLEAN)
    is_discharged!: boolean;
  }
  