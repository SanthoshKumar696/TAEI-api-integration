import { getISTDate } from "../utils/formatDateToLocalString";
import { LookupRepository } from '../repositories/LookupRepository';
import TraumaRepository from '../repositories/TraumaRepository';
import {
  LkpTraumaAssault, LkpTraumaOutcome, LkpTraumaGcsEye, LkpTraumaGcsMotor, LkpTraumaGcsVerbal, LkpTraumaInjuriesIdentified,
  LkpTraumaManagement, LkpTraumaMechanismOfInjury, LkpTraumaMechIntubationDtls, LkpTraumaOthProcedureDone, LkpTraumaPartOfTheBodyInjured,
  LkpTraumaRta, LkpTraumaSpecialityOpinion, LkpTraumaSurgeryDoneUnder, LkpTraumaFlag, LkpTraumaTypeOfInjury, LkpTraumaTypeOfSurgery, LkpTraumaWorkspotInjury,
  LkpTraumaCpr,
  LkpTraumaHospitalType,
  LkpTraumaConditionOfPatient,
  LkpTraumaDestinationHospital,
  LkpTraumaReasonForReferral,
  LkpTraumaSurgeryType
} from '../models/lookup/LkpTraumaModels';
import { Trauma } from '../models/Trauma';

export default class TraumaService {
  private repo = new TraumaRepository();

  async insertFull(data: any, userid: string): Promise<Trauma> {
    data.trauma.inserted_date = getISTDate();//new Date()
    data.trauma.user_id = Number(userid);
    return await this.repo.create(data);
  }

  async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    return this.repo.list(offset, limit, filters, hospital_id, start_date, end_date);
  }

  async getById(id: number): Promise<any | null> {
    const trauma = await this.repo.getTraumaById(id);
    const trauma_values = await this.repo.getTraumaValuesById(id);
    const trauma_final = await this.repo.getTraumaFinalById(id);
    const trauma_outcome = await this.repo.getTraumaOutcomeById(id);

    // Calculate the stayed_duration from date of admission and date of discharge
    if (trauma_outcome?.discharge_datetime && trauma?.date_time_of_entry) {
      const diffTime = Math.abs(trauma_outcome?.discharge_datetime?.getTime() - trauma?.date_time_of_entry?.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      trauma_outcome.stayed_duration = diffDays;
    }

    if (!trauma) return null;

    return {
      trauma,
      trauma_values,
      trauma_final,
      trauma_outcome,
    };
  }

  async update(id: number, data: any, userid: string): Promise<Trauma | null> {
    // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
    if ('date_time_of_entry' in data.trauma) {
      delete data.trauma.date_time_of_entry;
    }
    if ('inserted_date' in data.trauma) {
      delete data.trauma.inserted_date;
    }
    if ('user_id' in data.trauma) {
      delete data.trauma.user_id;
    }
    return await this.repo.update(id, data);
  }

  async delete(id: number): Promise<number> {
    return await this.repo.delete(id);
  }

  // async getById(id: number) {
  //   const trauma = await this.repo.getTraumaById(id);
  //   const trauma_values = await this.repo.getTraumaValuesById(id);
  //   const trauma_final = await this.repo.getTraumaFinalById(id);
  //   const trauma_transferred = await this.repo.getTransferredToById(id);

  //   if (!trauma) return null;

  //   return {
  //     trauma,
  //     trauma_values,
  //     trauma_final,
  //     trauma_transferred
  //   };
  // }

  // async updateFull(id: number, data: any) {
  //   console.log('in upd ser')
  //   const transaction = await sequelize.transaction();
  //   try {
  //     const result = await this.repo.update(id, data, transaction);
  //     await transaction.commit();
  //     return result;
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }

  // async delete(id: number) {
  //   const transaction = await sequelize.transaction();
  //   try {
  //     await this.repo.delete(id, transaction);
  //     await transaction.commit();
  //     return { message: 'Deleted successfully' };
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }


  async getAllLookups() {
    const RpoMechanismOfInjury = new LookupRepository(LkpTraumaMechanismOfInjury);
    const RpoTypeOfInjury = new LookupRepository(LkpTraumaTypeOfInjury);
    const RpoRta = new LookupRepository(LkpTraumaRta);
    const RpoAssault = new LookupRepository(LkpTraumaAssault);
    const RpoWorkspotInjury = new LookupRepository(LkpTraumaWorkspotInjury);
    const RpoGcsEye = new LookupRepository(LkpTraumaGcsEye);
    const RpoGcsVerbal = new LookupRepository(LkpTraumaGcsVerbal);
    const RpoGcsMotor = new LookupRepository(LkpTraumaGcsMotor);
    const RpoSpecialityOpinion = new LookupRepository(LkpTraumaSpecialityOpinion);
    const RpoMechIntubationDtls = new LookupRepository(LkpTraumaMechIntubationDtls);
    const RpoOthProcedureDone = new LookupRepository(LkpTraumaOthProcedureDone);
    const RpoManagement = new LookupRepository(LkpTraumaManagement);
    const RpoTypeOfSurgery = new LookupRepository(LkpTraumaTypeOfSurgery);
    const RpoSurgeryType = new LookupRepository(LkpTraumaSurgeryType);
    const RpoSurgeryDoneUnder = new LookupRepository(LkpTraumaSurgeryDoneUnder);
    const RpoCpr = new LookupRepository(LkpTraumaCpr);
    const RpoOutcome = new LookupRepository(LkpTraumaOutcome);
    const RpoHospitalType = new LookupRepository(LkpTraumaHospitalType);
    const RpoDestinationHospital = new LookupRepository(LkpTraumaDestinationHospital);
    const RpoReasonForReferral = new LookupRepository(LkpTraumaReasonForReferral);
    const RpoConditionOfPatient = new LookupRepository(LkpTraumaConditionOfPatient);
    const RpoFlag = new LookupRepository(LkpTraumaFlag);
    const RpoInjuriesIdentified = new LookupRepository(LkpTraumaInjuriesIdentified);
    const RpoPartOfTheBodyInjured = new LookupRepository(LkpTraumaPartOfTheBodyInjured);

    const MechanismOfInjury = await RpoMechanismOfInjury.getAll();
    const TypeOfInjury = await RpoTypeOfInjury.getAll();
    const Rta = await RpoRta.getAll();
    const Assault = await RpoAssault.getAll();
    const WorkspotInjury = await RpoWorkspotInjury.getAll();
    const GcsEye = await RpoGcsEye.getAll();
    const GcsVerbal = await RpoGcsVerbal.getAll();
    const GcsMotor = await RpoGcsMotor.getAll();
    const SpecialityOpinion = await RpoSpecialityOpinion.getAll();
    const MechIntubationDtls = await RpoMechIntubationDtls.getAll();
    const OthProcedureDone = await RpoOthProcedureDone.getAll();
    const Management = await RpoManagement.getAll();
    const TypeOfSurgery = await RpoTypeOfSurgery.getAll();
    const SurgeryType = await RpoSurgeryType.getAll();
    const SurgeryDoneUnder = await RpoSurgeryDoneUnder.getAll();
    const Cpr = await RpoCpr.getAll();
    const Outcome = await RpoOutcome.getAll();
    const HospitalType = await RpoHospitalType.getAll();
    const DestinationHospital = await RpoDestinationHospital.getAll();
    const ReasonForReferral = await RpoReasonForReferral.getAll();
    const ConditionOfPatient = await RpoConditionOfPatient.getAll();
    const Flag = await RpoFlag.getAll();
    const InjuriesIdentified = await RpoInjuriesIdentified.getAll();
    const PartOfTheBodyInjured = await RpoPartOfTheBodyInjured.getAll();

    return {
      MechanismOfInjury
      , TypeOfInjury
      , Rta
      , Assault
      , WorkspotInjury
      , GcsEye
      , GcsVerbal
      , GcsMotor
      , SpecialityOpinion
      , MechIntubationDtls
      , OthProcedureDone
      , Management
      , TypeOfSurgery
      , SurgeryType
      , SurgeryDoneUnder
      , Cpr
      , Outcome
      , HospitalType
      , DestinationHospital
      , ReasonForReferral
      , ConditionOfPatient
      , Flag
      , InjuriesIdentified
      , PartOfTheBodyInjured
    }
  }

  
  async getNonIndex(id: number) {
    const traumaData = await this.repo.getNonIndex(id);
    const trauma = traumaData.data;
    return trauma;
  }
}
