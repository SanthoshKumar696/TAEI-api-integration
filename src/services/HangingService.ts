import { getISTDate } from "../utils/formatDateToLocalString";
import { LookupRepository } from '../repositories/LookupRepository';
import { HangingRepository } from '../repositories/HangingRepository';
import {
    LkpHangingNatureOfIncident, LkpHangingSuspensionOfBody, LkpHangingMaterialsUsed
    , LkpHangingInterventions, LkpHangingSupportiveCareProvided,
    LkpHangingOutcome,
    LkpHangingSymptomsPresentation
} from '../models/lookup/LkpHangingModel';
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';

export class HangingService {
    private hangingRepository: HangingRepository;

    constructor() {
        this.hangingRepository = new HangingRepository();
    }

    async create(data: any, userid: string) {
        data.hanging.inserted_date = getISTDate();//new Date()
        data.hanging.user_id = Number(userid);
        return await this.hangingRepository.create(data);
    }

    async getAll() {
        return await this.hangingRepository.findAll();
    }

    async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return await this.hangingRepository.list(offset, limit, filters, hospital_id, start_date, end_date);
    }

    async getById(id: number) {
        const hanging = await this.hangingRepository.getHangingById(id);
        const outcome = await this.hangingRepository.getHangingOutcomeById(id);

        if (!hanging) return null;

        return {
            hanging,
            outcome
        };
    }

    async update(id: number, data: any, userid: string): Promise<any | null> {
        // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
        if ('date_time_of_entry' in data.hanging) {
            delete data.hanging.date_time_of_entry;
        }
        if ('inserted_date' in data.hanging) {
            delete data.hanging.inserted_date;
        }
        if ('user_id' in data.hanging) {
            delete data.hanging.user_id;
        }
        if ('ref_form_id' in data.hanging) {
            delete data.hanging.ref_form_id;
        }
        if ('ref_id' in data.hanging) {
            delete data.hanging.ref_id;
        }
        return await this.hangingRepository.update(id, data);
    }

    async delete(id: number) {
        return await this.hangingRepository.delete(id);
    }

    async getNonIndex(id: number) {
        const triageData = await this.hangingRepository.getNonIndex(id);
        const triage = triageData.data;
        return triage;
    }


    async getAllLookups() {
        const RpoHangingNatureOfIncident = new LookupRepository(LkpHangingNatureOfIncident);
        const RpoHangingSuspensionOfBody = new LookupRepository(LkpHangingSuspensionOfBody);
        const RpoHangingMaterialsUsed = new LookupRepository(LkpHangingMaterialsUsed);
        const RpoHangingSymptomsPresentation = new LookupRepository(LkpHangingSymptomsPresentation);
        const RpoHangingInterventions = new LookupRepository(LkpHangingInterventions);
        const RpoHangingSupportiveCareProvided = new LookupRepository(LkpHangingSupportiveCareProvided);
        const RpoHangingOutcome = new LookupRepository(LkpHangingOutcome);
        const RpoHospitalType = new LookupRepository(LkpHospitalType);
        const RpoDestinationHospital = new LookupRepository(LkpDestinationHospital);
        const RpoReasonForReferral = new LookupRepository(LkpReasonForReferral);
        const RpoConditionOfPatient = new LookupRepository(LkpConditionOfPatient);


        const NatureOfIncident = await RpoHangingNatureOfIncident.getAll();
        const SuspensionOfBody = await RpoHangingSuspensionOfBody.getAll();
        const MaterialsUsed = await RpoHangingMaterialsUsed.getAll();
        const SymptomsPresentation = await RpoHangingSymptomsPresentation.getAll();
        const Interventions = await RpoHangingInterventions.getAll();
        const SupportiveCareProvided = await RpoHangingSupportiveCareProvided.getAll();
        const Outcome = await RpoHangingOutcome.getAll();
        const HospitalType = await RpoHospitalType.getAll();
        const DestinationHospital = await RpoDestinationHospital.getAll();
        const ReasonForReferral = await RpoReasonForReferral.getAll();
        const ConditionOfPatient = await RpoConditionOfPatient.getAll();

        return {
            NatureOfIncident
            , SuspensionOfBody
            , MaterialsUsed
            , SymptomsPresentation
            , Interventions
            , SupportiveCareProvided
            , Outcome
            , HospitalType
            , DestinationHospital
            , ReasonForReferral
            , ConditionOfPatient
        }
    }
}
