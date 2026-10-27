import { getISTDate } from "../utils/formatDateToLocalString";
import { LkpDistrict, LkpHospitals, LkpState } from "../models/lookup/LkpCommonModel";
import {
  LkpTriageGender, LkpTriageMaritalStatus, LkpTriageEducation, LkpTriageEmploymentStatus, LkpTriageOccupation, LkpTriageModeOfArrival
  , LkpTriageSourceType, LkpTriageReasonForReferral, LkpTriageConditionOfPatient, LkpTriagePlaceOfIncident, LkpTriageDtlsAccompaniedBy
  , LkpTriageDtlsBurns, LkpTriageDtlsPoisoningBitesStingsHanging, LkpTriageDtlsScript, LkpTriageDtlsMiAcs, LkpTriageDtlsPcMedicalEmergency
  , LkpTriageDtlsPcSurgicalEmergency, LkpTriageDtlsAvpu, LkpTriageDtlsBreathingStatus, LkpTriageDtlsTriageFlag,
  LkpTriagePatientRecievedFrom,
  LkpTriageDtlsCause,
  LkpTriageDtlsPresentingComplaints,
  LkpTriageSceneIft,
  lkpTriageDtlsRta,
  lkpTriageDtlsRtaRiderType,
  lkpTriageDtlsWorkSpotInjury
} from "../models/lookup/LkpTriageModels";
import { LookupRepository } from "../repositories/LookupRepository";
import { TriageRepository } from "../repositories/TriageRepository";

const repo = new TriageRepository();

export class TriageService {

  async create(data: any, institution_id: number, userid: string) {
    data.triage.inserted_date = getISTDate(); // new Date()

    const userIdNum = Number(userid);
    data.triage.user_id = Number.isNaN(userIdNum) ? 1 : userIdNum;

    const hospitalIdNum = Number(institution_id);
    data.triage.institution_id = Number.isNaN(hospitalIdNum) ? 1 : hospitalIdNum;

    return await repo.create(data);
    // const triageId = await repo.insertFull(data.triage, data.triage_by_108, data.triage_dtls);
    // const triage = await repo.getTriageById(triageId);
    // const triage_by_108 = await repo.getTriageBy108ById(triageId);
    // const triage_dtls = await repo.getTriageDetailsById(triageId);

    // if (!triageId) return null;

    // return {
    //   triage,
    //   triage_by_108,
    //   triage_dtls,
    // };
  }

  // getList(page: number, size: number, filters: any) {
  //   const limit = size || 20;
  //   const offset = (page - 1) * limit;
  //   return repo.list(offset, limit, filters);
  // }

  async getList(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string, is_age12: boolean) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    return await repo.getList(offset, limit, filters, hospital_id, start_date, end_date, is_age12);
  }

  async getById(id: number) {
    const triage = await repo.getTriageById(id);
    const triage_by_108 = await repo.getTriageBy108ById(id);
    const triage_dtls = await repo.getTriageDetailsById(id);

    if (!triage) return null;

    return {
      triage,
      triage_by_108,
      triage_dtls,
    };
  }

  update(id: number, data: any, userid: string) {
    // Remove date_time_of_triage, insert date and user id if included in request body, it should not update again
    if ('date_time_of_triage' in data.triage) {
      delete data.triage.date_time_of_triage;
    }
    if ('inserted_date' in data.triage) {
      delete data.triage.inserted_date;
    }
    if ('user_id' in data.triage) {
      delete data.triage.user_id;
    }
    return repo.update(id, data);
  }


  delete(id: number) {
    return repo.delete(id);
  }

  async getAllLookups() {
    //const rpoAage = new LookupRepository(LkpTriageAge);
    const rpogender = new LookupRepository(LkpTriageGender);
    const rpoMtSts = new LookupRepository(LkpTriageMaritalStatus);
    const rpoEdu = new LookupRepository(LkpTriageEducation);
    const rpoEmpSts = new LookupRepository(LkpTriageEmploymentStatus);
    const rpoOcc = new LookupRepository(LkpTriageOccupation);
    const rpoPatientRecievedFrom = new LookupRepository(LkpTriagePatientRecievedFrom);
    const rpoArrival = new LookupRepository(LkpTriageModeOfArrival);
    const rpoSceneIft = new LookupRepository(LkpTriageSceneIft);
    const rpoSrctyp = new LookupRepository(LkpTriageSourceType);
    const rpoRor = new LookupRepository(LkpTriageReasonForReferral);
    const rpoCop = new LookupRepository(LkpTriageConditionOfPatient);
    const rpoPoI = new LookupRepository(LkpTriagePlaceOfIncident);
    const rpoAb = new LookupRepository(LkpTriageDtlsAccompaniedBy);
    const rpoBurns = new LookupRepository(LkpTriageDtlsBurns);
    const rpoPbsh = new LookupRepository(LkpTriageDtlsPoisoningBitesStingsHanging);
    const rpoScript = new LookupRepository(LkpTriageDtlsScript);
    const rpoMiAcs = new LookupRepository(LkpTriageDtlsMiAcs);
    const rpoMe = new LookupRepository(LkpTriageDtlsPcMedicalEmergency);
    const rpoSe = new LookupRepository(LkpTriageDtlsPcSurgicalEmergency);
    const rpoPresentingComplaints = new LookupRepository(LkpTriageDtlsPresentingComplaints);
    const rpoDtlsCause = new LookupRepository(LkpTriageDtlsCause);
    const rpoAvpu = new LookupRepository(LkpTriageDtlsAvpu);
    const rpoBs = new LookupRepository(LkpTriageDtlsBreathingStatus);
    const rpoTf = new LookupRepository(LkpTriageDtlsTriageFlag);
    const rpoDistrict = new LookupRepository(LkpDistrict);
    const rpoState = new LookupRepository(LkpState);
    const rpoWorkSpotInjury = new LookupRepository(lkpTriageDtlsWorkSpotInjury);
    const rpoRta = new LookupRepository(lkpTriageDtlsRta);
    const rpoRtaRiderType = new LookupRepository(lkpTriageDtlsRtaRiderType);

    //const age = await rpoAage.getAll();
    const genders = await rpogender.getAll();
    const MtSts = await rpoMtSts.getAll();
    const Edu = await rpoEdu.getAll();
    const EmpSts = await rpoEmpSts.getAll();
    const Occ = await rpoOcc.getAll();
    const prf = await rpoPatientRecievedFrom.getAll();
    const Arrival = await rpoArrival.getAll();
    const SceneIft = await rpoSceneIft.getAll();
    const Srctyp = await rpoSrctyp.getAll();
    const Ror = await rpoRor.getAll();
    const Cop = await rpoCop.getAll();
    const PoI = await rpoPoI.getAll();
    const Ab = await rpoAb.getAll();
    const Burns = await rpoBurns.getAll();
    const Pbsh = await rpoPbsh.getAll();
    const Script = await rpoScript.getAll();
    const MiAcs = await rpoMiAcs.getAll();
    const Me = await rpoMe.getAll();
    const Se = await rpoSe.getAll();
    const Pc = await rpoPresentingComplaints.getAll();
    const Cause = await rpoDtlsCause.getAll();
    const Avpu = await rpoAvpu.getAll();
    const Bs = await rpoBs.getAll();
    const Tf = await rpoTf.getAll();
    const District = await rpoDistrict.getAll();
    const State = await rpoState.getAll();
    const Wsi = await rpoWorkSpotInjury.getAll();
    const Rta = await rpoRta.getAll();
    const Rrt = await rpoRtaRiderType.getAll();

    return {
      //age,
      genders
      , MtSts
      , Edu
      , EmpSts
      , Occ
      , prf
      , Arrival
      , SceneIft
      , Srctyp
      , Ror
      , Cop
      , PoI
      , Ab
      , Burns
      , Pbsh
      , Script
      , MiAcs
      , Me
      , Se
      , Pc
      , Cause
      , Avpu
      , Bs
      , Tf
      , District
      , State
      , Wsi
      , Rta
      , Rrt
    }
  }

  async getHospitals() {
    const rpoHospitals = new LookupRepository(LkpHospitals);
    const Hospitals = await rpoHospitals.getHospitals();
    return {
      Hospitals
    }
  }

  async getNonIndex(id: number) {
    const triageData = await repo.getNonIndex(id);
    const triage = triageData.data;
    return triage;
  }

}