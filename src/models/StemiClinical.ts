import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    BelongsTo,
    ForeignKey,
  } from 'sequelize-typescript';
  
  import { LkpStemiCvRiskFactorMaster,LkpStemiFmcMaster,LkpStemiEcgLocationMaster,LkpStemiDiagnosisMaster } from './lookup/LkpStemiModels';
//   import { LkpStemiFmcMaster } from './LkpStemiFmcMaster';
//   import { LkpStemiEcgLocationMaster } from './LkpStemiEcgLocationMaster';
//   import { LkpStemiDiagnosisMaster } from './LkpStemiDiagnosisMaster';

  
  @Table({ tableName: 'stemi_clinical_assessment', timestamps: false })
  export class StemiClinicalAssessment extends Model<StemiClinicalAssessment> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    // Link to patient/triage
    
    @Column(DataType.INTEGER)
    triage_id!: number;
  
    // Date & Time of Symptom Onset
    @Column({ type: DataType.DATE, allowNull: true })
    symptom_onset_datetime?: Date;
  
    // Cardiovascular Risk Factors (FK to master)
    @ForeignKey(() => LkpStemiCvRiskFactorMaster)
    @Column(DataType.INTEGER)
    cv_risk_factors!: number;
  
    @BelongsTo(() => LkpStemiCvRiskFactorMaster)
    cv_risk_factor!: LkpStemiCvRiskFactorMaster;
  

    @Column({ type: DataType.STRING(200), allowNull: true })
    risk_factors?: string;

    @Column({ type: DataType.STRING(200), allowNull: true })
    other_risk_factor?: string;

    // Signs & Symptoms (free text or possibly CSV list of master IDs)
    @Column({ type: DataType.STRING(200), allowNull: true })
    signs_symtoms?: string;
  
    @Column(DataType.STRING(255))
    other_signs_symtoms!: string;

    // First Medical Contact (FMC)
    @ForeignKey(() => LkpStemiFmcMaster)
    @Column(DataType.INTEGER)
    fmc_type!: number;
  
    @BelongsTo(() => LkpStemiFmcMaster)
    fmc_type1!: LkpStemiFmcMaster;
  
    @Column({ type: DataType.DATE, allowNull: true })
    fmc_datetime?: Date;
  
    // ECG Taken
    @Column({ type: DataType.DATE, allowNull: true })
    ecg_datetime?: Date;
  
    @ForeignKey(() => LkpStemiEcgLocationMaster)
    @Column(DataType.INTEGER)
    ecg_location!: number;
  
    @BelongsTo(() => LkpStemiEcgLocationMaster)
    ecg_locations!: LkpStemiEcgLocationMaster;
  
    // Diagnosis
    @ForeignKey(() => LkpStemiDiagnosisMaster)
    @Column(DataType.INTEGER)
    diagnosis!: number;
  
    @BelongsTo(() => LkpStemiDiagnosisMaster)
    diagnosiss!: LkpStemiDiagnosisMaster;

    @Column({ type: DataType.STRING(255) })
    other_dignosis?: string;
  }
  