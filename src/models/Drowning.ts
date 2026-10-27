import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'drowning_cases', timestamps: false })
export class DrowningCase extends Model<DrowningCase> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER) 
  triage_id!: number;
  // Admission Details
  @Column(DataType.INTEGER)
  patient_admitted_id!: number;

  @Column(DataType.STRING(255))
  admitting_department!: string;

  @Column(DataType.DATE)
  admission_datetime!: Date;

  // Drowning Details
  @Column(DataType.INTEGER)
  place_of_incident_id!: number;

  @Column(DataType.INTEGER)
  type_of_water_id!: number;

  @Column(DataType.INTEGER)
  activity_during_drowning_id!: number;

  // Treatment & Management
  @Column(DataType.INTEGER)
  assessment_id!: number;

  @Column(DataType.INTEGER)
  intervention_id!: number;

  @Column(DataType.INTEGER)
  counselling_before_discharge_id!: number;

  @Column(DataType.DATE)
  discharge_datetime!: Date;

  // Auto-calculated duration (you can compute in query, not stored directly)
  @Column(DataType.INTEGER)
  duration_of_hospital_stay!: number;

  // Multiple choice stored as text (comma-separated IDs/names)
  @Column(DataType.STRING(255))
  complications_admission!: string;

  @Column(DataType.STRING(255))
  supportive_care!: string;

  @Column(DataType.STRING(255))
  complications_developed!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at!: Date;

  @Column(DataType.DATE)
  date_time_entry!: Date;

  @Column(DataType.STRING(255))
  other_place!: string;
  @Column(DataType.STRING(255))
  other_type_water!: string;
  @Column(DataType.STRING(255))
  other_activity!: string;
  @Column(DataType.STRING(255))
  other_complication_admitted!: string;
  @Column(DataType.STRING(255))
  other_complications_developed!: string;
  @Column(DataType.STRING(255))
  other_interventions!: string;
  @Column(DataType.STRING(255))
  other_supportive_care!: string;
}
