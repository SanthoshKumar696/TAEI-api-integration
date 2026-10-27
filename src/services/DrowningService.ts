import { LookupAllRepository } from "../repositories/LookupAllRepository";
import { DrowningRepository } from "../repositories/DrowningRepository";

// Import drowning lookup models
import {
  LkpYesNo,
  LkpDrwPlaceOfIncident,
  LkpDrwTypeOfWater,
  LkpDrwActivityDuringDrowning,
  LkpDrwAssessment,
  LkpDrwIntervention,
  LkpDrwHospitalType,
  LkpDrwOutcomeType,
  LkpDrwReferralReason,
  LkpDrwPatientCondition,
  // LkpDrwCounsellingBeforeDischarge,
  LkpDrwComplicationsAdmission,
  LkpDrwSupportiveCare,
  LkpDrwComplicationsDeveloped,

} from "../models/lookup/LkpDrowningModels";

// Import common lookup models
import {
  LkpHospitalType,
  LkpDestinationHospital,
  LkpReasonForReferral,
  LkpConditionOfPatient,
  LkpHospitals
} from "../models/lookup/LkpCommonModel";

export class DrowningService {
  private repo = new DrowningRepository();

  async create_drowning_all(data: any) {
    return this.repo.create_drowning_all(data);
  }
  async find_drowning_all(id: number) {
    return this.repo.get_drowing_all(id);
  }
  async create(data: any) {
    return this.repo.create(data);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    return this.repo.findById(id);
  }

  async list(page: number, size: number, filters: any, hospital_id: number,start_date: string,
    end_date: string) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    return await this.repo.list(offset, limit, filters, hospital_id,start_date,end_date);
  }

  async update(id: number, data: any) {
    return this.repo.update(id, data);
  }
  async delete(id: number) {
    return this.repo.delete(id);
  }


  async outcome_create(data: any) {
    return this.repo.outcome_create(data);
  }

  async outcome_findAll() {
    return this.repo.outcome_findAll();
  }

  async outcome_findById(id: number) {
    return this.repo.outcome_findById(id);
  }

  async outcome_update(id: number, data: any) {
    return this.repo.outcome_update(id, data);
  }
  
      async getNonIndex(id: number) {
          const triageData = await this.repo.getNonIndex(id);
          const triage = triageData.data;
          return triage;
      }



  async getAllLookups() {
    const RpoYesNo = new LookupAllRepository(LkpYesNo);
    const RpoPlaceOfIncident = new LookupAllRepository(LkpDrwPlaceOfIncident);
    const RpoTypeOfWater = new LookupAllRepository(LkpDrwTypeOfWater);
    const RpoActivityDuringDrowning = new LookupAllRepository(LkpDrwActivityDuringDrowning);
    const RpoAssessment = new LookupAllRepository(LkpDrwAssessment);
    const RpoInterventions = new LookupAllRepository(LkpDrwIntervention);

    const RpoHospitalType = new LookupAllRepository(LkpHospitalType);
    const RpoDestinationHospital = new LookupAllRepository(LkpDestinationHospital);
    const RpoReasonForReferral = new LookupAllRepository(LkpReasonForReferral);
    const RpoConditionOfPatient = new LookupAllRepository(LkpConditionOfPatient);


    const RpoLkpDrwHospitalType = new LookupAllRepository(LkpDrwHospitalType);
    const RpoLkpDrwOutcomeType = new LookupAllRepository(LkpDrwOutcomeType);
    const RpoLkpDrwReferralReason = new LookupAllRepository(LkpDrwReferralReason);
    const RpoLkpDrwPatientCondition = new LookupAllRepository(LkpDrwPatientCondition);



    const RpoLkpDrwCounsellingBeforeDischarge = new LookupAllRepository(LkpYesNo);
    const RpoLkpDrwComplicationsAdmission = new LookupAllRepository(LkpDrwComplicationsAdmission);
    const RpoLkpDrwSupportiveCare = new LookupAllRepository(LkpDrwSupportiveCare);
    const RpoLkpDrwComplicationsDeveloped = new LookupAllRepository(LkpDrwComplicationsDeveloped);

    const RpoLkpHospital=new LookupAllRepository(LkpHospitals)


    const YesNo = await RpoYesNo.getAll();
    const PlaceOfIncident = await RpoPlaceOfIncident.getAll();
    const TypeOfWater = await RpoTypeOfWater.getAll();
    const ActivityDuringDrowning = await RpoActivityDuringDrowning.getAll();
    const Assessment = await RpoAssessment.getAll();
    const Interventions = await RpoInterventions.getAll();

    const HospitalType = await RpoHospitalType.getAll();
    const DestinationHospital = await RpoDestinationHospital.getAll();
    const ReasonForReferral = await RpoReasonForReferral.getAll();
    const ConditionOfPatient = await RpoConditionOfPatient.getAll();

    const Out_HospitalType = await RpoLkpDrwHospitalType.getAll();
    const OutcomeType = await RpoLkpDrwOutcomeType.getAll();
    const ReferralReason = await RpoLkpDrwReferralReason.getAll();
    const PatientCondition = await RpoLkpDrwPatientCondition.getAll();

    const counselling_before_discharge = await RpoLkpDrwCounsellingBeforeDischarge.getAll();
    const complications_admission = await RpoLkpDrwComplicationsAdmission.getAll();
    const supportive_care = await RpoLkpDrwSupportiveCare.getAll();
    const complications_developed = await RpoLkpDrwComplicationsDeveloped.getAll();

    const Hospitals=await RpoLkpHospital.getAll();

    return {
      YesNo,
      PlaceOfIncident,
      TypeOfWater,
      ActivityDuringDrowning,
      Assessment,
      Interventions,
      counselling_before_discharge,
      complications_admission,
      supportive_care,
      complications_developed,
      HospitalType,
      DestinationHospital,
      ReasonForReferral,
      ConditionOfPatient,
      Out_HospitalType,
      OutcomeType,
      ReferralReason,
      PatientCondition,
      Hospitals

    };
  }
}
