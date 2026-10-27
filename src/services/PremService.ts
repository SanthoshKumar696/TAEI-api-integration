import { getISTDate } from "../utils/formatDateToLocalString";
import { LookupRepository } from "../repositories/LookupRepository";
import { Prem } from "../models/Prem";
import { PremRepository } from "../repositories/PremRepository";
import {
  LkpPremPresentingComplaints, LkpPremAirway, LkpPremBreathing, LkpPremCirculationHr, LkpPremPerfusion, LkpPremLiverSpan, LkpPremSystolicBp, LkpPremMap,
  LkpPremDisability, LkpPremTonePosture, LkpPremEyePositionMovements, LkpPremPupils, LkpPremDevelopment, LkpPremDiagnosis, LkpPremDiagnosisRef,
  LkpPremTriageFlag, LkpPremProceduresDone, LkpPremOutcome, LkpPremStabilisedReferral
} from "../models/lookup/LkpPremModel";
import { LkpHospitalType, LkpReasonForReferral, LkpConditionOfPatient } from "../models/lookup/LkpCommonModel";

export class PremService {
  private premRepo = new PremRepository();

  async create(data: any, userid: string): Promise<Prem> {
    data.prem.inserted_date = getISTDate();//new Date()
    data.prem.user_id = Number(userid);
    return this.premRepo.create(data);
  }

  async getAll(): Promise<Prem[]> {
    return this.premRepo.findAll();
  }

  async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    return this.premRepo.list(offset, limit, filters, hospital_id, start_date, end_date);
  }

  async getById(id: number): Promise<any | null> {
    const prem = await this.premRepo.getPremById(id);
    const vitals = await this.premRepo.getPremVitalsById(id);
    const outcome = await this.premRepo.getPremOutcomeById(id);

    if (!prem) return null;

    return {
      prem,
      vitals,
      outcome
    };
  }

  async update(id: number, data: any, userid: string): Promise<Prem | null> {
    // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
    if ('date_time_of_entry' in data.prem) {
      delete data.prem.date_time_of_entry;
    }
    if ('inserted_date' in data.prem) {
      delete data.prem.inserted_date;
    }
    if ('user_id' in data.prem) {
      delete data.prem.user_id;
    }
    if ('ref_form_id' in data.prem) {
      delete data.prem.ref_form_id;
    }
    if ('ref_id' in data.prem) {
      delete data.prem.ref_id;
    }

    return this.premRepo.update(id, data);
  }

  async delete(id: number): Promise<number> {
    return this.premRepo.delete(id);
  }

  async getNonIndex(id: number) {
    const triageData = await this.premRepo.getNonIndex(id);
    const triage = triageData.data;
    return triage;
  }

  async getAllLookups() {
    const RpoPremPresentingComplaints = new LookupRepository(LkpPremPresentingComplaints);
    const RpoPremAirway = new LookupRepository(LkpPremAirway);
    const RpoPremBreathing = new LookupRepository(LkpPremBreathing);
    const RpoPremCirculationHr = new LookupRepository(LkpPremCirculationHr);
    const RpoPremPerfusion = new LookupRepository(LkpPremPerfusion);
    const RpoPremLiverSpan = new LookupRepository(LkpPremLiverSpan);
    const RpoPremSystolicBp = new LookupRepository(LkpPremSystolicBp);
    const RpoPremMap = new LookupRepository(LkpPremMap);
    const RpoPremDisability = new LookupRepository(LkpPremDisability);
    const RpoPremTonePosture = new LookupRepository(LkpPremTonePosture);
    const RpoPremEyePositionMovements = new LookupRepository(LkpPremEyePositionMovements);
    const RpoPremPupils = new LookupRepository(LkpPremPupils);
    const RpoPremDevelopment = new LookupRepository(LkpPremDevelopment);
    const RpoPremDiagnosis = new LookupRepository(LkpPremDiagnosis);
    const RpoPremDiagnosisRef = new LookupRepository(LkpPremDiagnosisRef);
    const RpoPremTriageFlag = new LookupRepository(LkpPremTriageFlag);
    const RpoPremProceduresDone = new LookupRepository(LkpPremProceduresDone);
    const RpoPremOutcome = new LookupRepository(LkpPremOutcome);
    const RpoPremStabilisedReferral = new LookupRepository(LkpPremStabilisedReferral);

    const RpoHospitalType = new LookupRepository(LkpHospitalType);
    const RpoReasonForReferral = new LookupRepository(LkpReasonForReferral);
    const RpoConditionOfPatient = new LookupRepository(LkpConditionOfPatient);

    const PresentingComplaints = await RpoPremPresentingComplaints.getAll();
    const Airway = await RpoPremAirway.getAll();
    const Breathing = await RpoPremBreathing.getAll();
    const CirculationHr = await RpoPremCirculationHr.getAll();
    const Perfusion = await RpoPremPerfusion.getAll();
    const LiverSpan = await RpoPremLiverSpan.getAll();
    const SystolicBp = await RpoPremSystolicBp.getAll();
    const Map = await RpoPremMap.getAll();
    const Disability = await RpoPremDisability.getAll();
    const TonePosture = await RpoPremTonePosture.getAll();
    const EyePositionMovements = await RpoPremEyePositionMovements.getAll();
    const Pupils = await RpoPremPupils.getAll();
    const Development = await RpoPremDevelopment.getAll();
    const Diagnosis = await RpoPremDiagnosis.getAll();
    const DiagnosisRef = await RpoPremDiagnosisRef.getAll();
    const TriageFlag = await RpoPremTriageFlag.getAll();
    const ProceduresDone = await RpoPremProceduresDone.getAll();
    const Outcome = await RpoPremOutcome.getAll();
    const StabilisedReferral = await RpoPremStabilisedReferral.getAll();
    const HospitalType = await RpoHospitalType.getAll();
    const ReasonForReferral = await RpoReasonForReferral.getAll();
    const ConditionOfPatient = await RpoConditionOfPatient.getAll();


    return {
      PresentingComplaints
      , Airway
      , Breathing
      , CirculationHr
      , Perfusion
      , LiverSpan
      , SystolicBp
      , Map
      , Disability
      , TonePosture
      , EyePositionMovements
      , Pupils
      , Development
      , Diagnosis
      , DiagnosisRef
      , TriageFlag
      , ProceduresDone
      , Outcome
      , StabilisedReferral
      , HospitalType
      , ReasonForReferral
      , ConditionOfPatient
    }
  }
}
