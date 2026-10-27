// src/db.ts
import { Sequelize } from 'sequelize-typescript';

import { ABHA_CONFIG } from "./abha.config";
import * as TriageModels from '../models/lookup/LkpTriageModels';
import * as EmotriageModel from '../models/lookup/LkpEmoTriageModels';
import * as TraumaModels from '../models/lookup/LkpTraumaModels';
import * as BurnsLkpModels from '../models/lookup/LkpBurnsModel';
import * as PoisonLkpModels from '../models/lookup/LkpPoisonsModel';
import * as BitesStingsLkpModels from '../models/lookup/LkpBitesStingsModel';
import * as HangingLkpModels from '../models/lookup/LkpHangingModel';
import * as StrokeLkpModels from '../models/lookup/LkpStrokeModel';
import * as PremLkpModels from '../models/lookup/LkpPremModel';
import * as CommonModels from '../models/lookup/LkpCommonModel';
import * as StemiLkpModel from '../models/lookup/LkpStemiModels';
import * as LkpDrowningModels from '../models/lookup/LkpDrowningModels';
import { Burns } from '../models/Burns';
import { BurnsOutcome } from '../models/BurnsOutcome';
import { BurnsValues } from '../models/BurnsValues';
import { Poisons } from '../models/Poisons';
import { PoisonsOutcome } from '../models/PoisonsOutcome';
import { BitesStings } from '../models/BitesStings';
import { BitesStingsOutcome } from '../models/BitesStingsOutcome';
import { Hanging } from '../models/Hanging';
import { HangingOutcome } from '../models/HangingOutcome';
import { Stroke } from '../models/Stroke';
import { StrokeOutcome } from '../models/Stroke_Outcome';
import { Prem } from '../models/Prem';
import { PremVitals } from '../models/PremVitals';
import { PremOutcome } from '../models/PremOutcome';
import { Trauma } from '../models/Trauma';
import { TraumaFinal } from '../models/TraumaFinal';
import { TraumaValues } from '../models/TraumaValues';
import { TraumaOutcome } from '../models/TraumaOutcome';
import { Triage } from '../models/Triage';
import { TriageBy108 } from '../models/TriageBy108';
import { TriageDtls } from '../models/TriageDtls';
import { EmoTriage } from '../models/EmoTriageModel';
import { StemiClinicalAssessment } from '../models/StemiClinical';
import { StemiTreatment } from '../models/StemiTreatment';
import { StemiOutcome } from '../models/StemiOutcome';
import { NstemiTreatment } from '../models/NStemiTreatment';
import { NstemiOutcome } from '../models/NStemiOutcome';
import { UnstableAnginaTreatment } from '../models/UnstableanginaTreatment';
import { UnstableAnginaOutcome } from '../models/UnstableanginaOutcome';
import { BurnsSurgeryElective } from '../models/BurnsSurgeryElective';
import { BurnsTbsa } from '../models/BurnsTbsa';
import { StemiAdmission } from '../models/StemiAdmission';
import { DrowningCase } from '../models/Drowning';
import { DrowningOutcome } from '../models/DrowningOutcome';
import { Cases108 } from '../models/Cases108';
import { OpPatient } from '../models/OPPatient';
import logger from '../utils/logger';
import { StemiOthersTreatment } from '../models/StemiOthersTreatment';
import { EmoTriageOutcome } from '../models/EmoTriageOutcome';
import { AbhaProfile } from '../models/AbhaProfile';



export const sequelize = new Sequelize({
  dialect: 'postgres',

  // Azure Database for PostgreSQL connection settings
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false
    }
  },

  replication: {
    write: {
  host: ABHA_CONFIG.DB.HOST,
  port: ABHA_CONFIG.DB.PORT,
  username: ABHA_CONFIG.DB.USER,
  password: ABHA_CONFIG.DB.PASSWORD,
  database: ABHA_CONFIG.DB.NAME,
},
   read: [
  {
    host: ABHA_CONFIG.DB.HOST,
    port: ABHA_CONFIG.DB.PORT,
    username: ABHA_CONFIG.DB.USER,
    password: ABHA_CONFIG.DB.PASSWORD,
    database: ABHA_CONFIG.DB.NAME,
  }
]
    // read: [
    //   {
    //     host: process.env.DB_READ_HOST,
    //     port: +process.env.DB_PORT!,
    //     username: process.env.DB_READ_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_NAME,
    //   }
    // ]
  },
  pool: {
    max: 75,
    min: 5,
    idle: 15000,
    acquire: 30000
  },
  logging: (msg, timing) => {
    if (timing) {
      logger.info(`SQL Query executed in ${timing} ms: ${msg}`);
    } else {
      logger.debug(`SQL: ${msg}`);
    }
  },
  benchmark: true, // enables query duration logging
  models: [EmoTriage, EmoTriageOutcome
    , ...Object.values(EmotriageModel)
    , Triage, TriageBy108, TriageDtls,AbhaProfile
    , ...Object.values(TriageModels)
    , Trauma, TraumaValues, TraumaFinal, TraumaOutcome
    , ...Object.values(TraumaModels)
    , ...Object.values(CommonModels)
    , Burns, BurnsValues, BurnsOutcome, BurnsTbsa, BurnsSurgeryElective
    , ...Object.values(BurnsLkpModels)
    , Poisons, PoisonsOutcome
    , ...Object.values(PoisonLkpModels)
    , BitesStings, BitesStingsOutcome
    , ...Object.values(BitesStingsLkpModels)
    , Hanging, HangingOutcome
    , ...Object.values(HangingLkpModels)
    , Stroke, StrokeOutcome
    , ...Object.values(StrokeLkpModels)
    , Prem, PremVitals, PremOutcome
    , ...Object.values(PremLkpModels)
    // ,StemiClinicalAssessment,StemiTreatment,StemiOutcome,NstemiTreatment,NstemiOutcome,UnstableAnginaTreatment,UnstableAnginaOutcome
    // , ...Object.values(StemiLkpModels)
    , StemiAdmission
    , StemiClinicalAssessment
    , StemiTreatment
    , StemiOutcome
    , NstemiTreatment
    , NstemiOutcome
    , UnstableAnginaTreatment
    , UnstableAnginaOutcome
    , DrowningCase
    , DrowningOutcome
    , ...Object.values(StemiLkpModel)
    , ...Object.values(LkpDrowningModels)
    , Cases108
    , OpPatient
    , StemiOthersTreatment
  ],
});