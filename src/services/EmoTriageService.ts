import { getISTDate } from "../utils/formatDateToLocalString";
import {
  LkpEmoRecallInfo, LkpEmoSpeech, LkpEmoGenDisposition, LkpEmoClothing, LkpEmoOrientationTime
  , LkpEmoEmergencyCategory, LkpEmoPastHistory, LkpEmoTraumaTreatment,
  LkpEmoOutcome
} from '../models/lookup/LkpEmoTriageModels';
import { EmoTriage } from '../models/EmoTriageModel';
import { EmoTriageRepository } from '../repositories/EmoTriageRepository';
import { LookupRepository } from '../repositories/LookupRepository';
import { LkpHospitalType, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';

export class EmoTriageService {

  private repo = new EmoTriageRepository();

  async getAll(): Promise<EmoTriage[]> {
    return this.repo.findAll();
  }

  async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    return this.repo.list(offset, limit, filters, hospital_id, start_date, end_date);
  }

  async getById(id: number): Promise<any | null> {
    const emo = await this.repo.getEmoTriageById(id);
    const emo_outcome = await this.repo.getEmoTriageOutcomeById(id);

    if (!emo) return null;

    return {
      emo,
      emo_outcome
    };
  }

  async create(data: any, userid: string): Promise<EmoTriage> {
    data.emo.inserted_date = getISTDate();//new Date()
    data.emo.user_id = Number(userid);
    return this.repo.create(data);
  }

  async update(id: number, data: any, userid: string): Promise<any | null> {
    // Remove insert date and user id if included in request body, it should not update again
    if ('inserted_date' in data.emo) {
      delete data.emo.inserted_date;
    }
    if ('user_id' in data.emo) {
      delete data.emo.user_id;
    }
    return this.repo.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

  async getAllLookups() {
    const RpoPastHistory = new LookupRepository(LkpEmoPastHistory);
    const RpoEmergencyCategory = new LookupRepository(LkpEmoEmergencyCategory);
    const RpoTraumaTreatment = new LookupRepository(LkpEmoTraumaTreatment);
    const RpoRecallInfo = new LookupRepository(LkpEmoRecallInfo);
    const RpoSpeech = new LookupRepository(LkpEmoSpeech);
    const RpoGenDisposition = new LookupRepository(LkpEmoGenDisposition);
    const RpoClothing = new LookupRepository(LkpEmoClothing);
    const RpoOrientationTime = new LookupRepository(LkpEmoOrientationTime);
    const RpoEmoOutcome = new LookupRepository(LkpEmoOutcome);
    const RpoHospitalType = new LookupRepository(LkpHospitalType);
    const RpoReasonForReferral = new LookupRepository(LkpReasonForReferral);
    const RpoConditionOfPatient = new LookupRepository(LkpConditionOfPatient);

    const PastHistory = await RpoPastHistory.getAll();
    const EmergencyCategory = await RpoEmergencyCategory.getAll();
    const TraumaTreatment = await RpoTraumaTreatment.getAll();
    const RecallInfo = await RpoRecallInfo.getAll();
    const Speech = await RpoSpeech.getAll();
    const GenDisposition = await RpoGenDisposition.getAll();
    const Clothing = await RpoClothing.getAll();
    const OrientationTime = await RpoOrientationTime.getAll();
    const EmoOutcome = await RpoEmoOutcome.getAll();
    const HospitalType = await RpoHospitalType.getAll();
    const ReasonForReferral = await RpoReasonForReferral.getAll();
    const ConditionOfPatient = await RpoConditionOfPatient.getAll();

    return {
      PastHistory
      , EmergencyCategory
      , TraumaTreatment
      , RecallInfo
      , Speech
      , GenDisposition
      , Clothing
      , OrientationTime
      , EmoOutcome
      , HospitalType
      , ReasonForReferral
      , ConditionOfPatient
    }
  }

  async getNonIndex(id: number) {
    const emoData = await this.repo.getNonIndex(id);
    const emo = emoData.data;
    return emo
  }
}
