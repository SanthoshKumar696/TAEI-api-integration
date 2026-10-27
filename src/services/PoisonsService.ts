import { getISTDate } from "../utils/formatDateToLocalString";
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';
import {
    LkpPoisonTypeOfPoisoning, LkpPoisonRouteOfExposure, LkpPoisonSubstanceInvolved, LkpPoisonSubstanceInvolvedSub, LkpPoisonSourceOfSubstance,
    LkpPoisonSeverityOfPoisoning, LkpPoisonDecontamination, LkpPoisonSupportiveCareProvided, LkpPoisonOutcome, LkpPoisonSymptomsPresentation
} from '../models/lookup/LkpPoisonsModel';
import { LookupRepository } from '../repositories/LookupRepository';
import { PoisonsRepository } from '../repositories/PoisonsRepository';

export class PoisonsService {
    constructor(private repo = new PoisonsRepository()) { }

    async create(data: any, userid: string) {
        data.poison.inserted_date = getISTDate();//new Date()
        data.poison.user_id = Number(userid);
        return this.repo.create(data);
    }
    async getAll() { return this.repo.findAll(); }

    async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return this.repo.list(offset, limit, filters, hospital_id, start_date, end_date);
    }
    async getById(id: number) {
        const poison = await this.repo.getPoisonsById(id);
        const poisons_outcome = await this.repo.getPoisonsOutcomeById(id);

        if (!poison) return null;

        return {
            poison,
            poisons_outcome
        };
    }
    async getByTriageId(id: number) {
        const poison = await this.repo.getPoisonsByTriageId(id);
        let poisons_outcome = null;

        if (!poison) return null;
        poisons_outcome = await this.repo.getPoisonsOutcomeById(poison.id);

        return {
            poison,
            poisons_outcome
        };
    }
    async update(id: number, data: any, userid: string) {
        // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
        if ('date_time_of_entry' in data.poison) {
            delete data.poison.date_time_of_entry;
        }
        if ('inserted_date' in data.poison) {
            delete data.poison.inserted_date;
        }
        if ('user_id' in data.poison) {
            delete data.poison.user_id;
        }
        if ('ref_form_id' in data.poison) {
            delete data.poison.ref_form_id;
        }
        if ('ref_id' in data.poison) {
            delete data.poison.ref_id;
        }
        return this.repo.update(id, data);
    }
    async delete(id: number) { return this.repo.delete(id); }

    async getNonIndex(id: number) {
        const triageData = await this.repo.getNonIndex(id);
        const triage = triageData.data;
        return triage;
    }


    async getAllLookups() {
        const RpoTypeOfPoisoning = new LookupRepository(LkpPoisonTypeOfPoisoning);
        const RpoRouteOfExposure = new LookupRepository(LkpPoisonRouteOfExposure);
        const RpoSubstanceInvolved = new LookupRepository(LkpPoisonSubstanceInvolved);
        const RpoSubstanceInvolvedSub = new LookupRepository(LkpPoisonSubstanceInvolvedSub);
        const RpoSourceOfSubstance = new LookupRepository(LkpPoisonSourceOfSubstance);
        const RpoSeverityOfPoisoning = new LookupRepository(LkpPoisonSeverityOfPoisoning);
        const RpoDecontamination = new LookupRepository(LkpPoisonDecontamination);
        const RpoSupportiveCareProvided = new LookupRepository(LkpPoisonSupportiveCareProvided);
        const RpoPoisonOutcome = new LookupRepository(LkpPoisonOutcome);
        const RpoOhHospitalType = new LookupRepository(LkpHospitalType);
        const RpoOhDestinationHospital = new LookupRepository(LkpDestinationHospital);
        const RpoOhReasonForReferral = new LookupRepository(LkpReasonForReferral);
        const RpoOhConditionOfPatient = new LookupRepository(LkpConditionOfPatient);
        const RpoSymptomsPresentation = new LookupRepository(LkpPoisonSymptomsPresentation);

        const TypeOfPoisoning = await RpoTypeOfPoisoning.getAll();
        const RouteOfExposure = await RpoRouteOfExposure.getAll();
        const SubstanceInvolved = await RpoSubstanceInvolved.getAll();
        const SubstanceInvolvedSub = await RpoSubstanceInvolvedSub.getAll();
        const SourceOfSubstance = await RpoSourceOfSubstance.getAll();
        const SeverityOfPoisoning = await RpoSeverityOfPoisoning.getAll();
        const Decontamination = await RpoDecontamination.getAll();
        const SupportiveCareProvided = await RpoSupportiveCareProvided.getAll();
        const Outcome = await RpoPoisonOutcome.getAll();
        const HospitalType = await RpoOhHospitalType.getAll();
        const DestinationHospital = await RpoOhDestinationHospital.getAll();
        const ReasonForReferral = await RpoOhReasonForReferral.getAll();
        const ConditionOfPatient = await RpoOhConditionOfPatient.getAll();
        const SymptomsPresentation = await RpoSymptomsPresentation.getAll();

        return {

            TypeOfPoisoning
            , RouteOfExposure
            , SubstanceInvolved
            , SubstanceInvolvedSub
            , SourceOfSubstance
            , SeverityOfPoisoning
            , Decontamination
            , SupportiveCareProvided
            , Outcome
            , HospitalType
            , DestinationHospital
            , ReasonForReferral
            , ConditionOfPatient
            , SymptomsPresentation
        }
    }
}
