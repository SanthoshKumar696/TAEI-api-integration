import { LookupRepository } from "../repositories/LookupRepository";
import { BitesStingsRepository } from "../repositories/BitesStingsRepository";
import { LkpBiteTypeOfBiteSting, LkpBiteVenomousType, LkpBiteSiteOfBiteSting, LkpBiteSupportiveCareProvided, LkpBiteTypeOfOrganism, LkpBiteOutcome, LkpBiteSymptomsPresentation, LkpBiteTimeInterval } from "../models/lookup/LkpBitesStingsModel";
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from "../models/lookup/LkpCommonModel";
import { getISTDate } from "../utils/formatDateToLocalString";

export class BitesStingsService {
    private repo = new BitesStingsRepository();

    async create(data: any, userid: string) {
        data.bites_stings.inserted_date = getISTDate();//new Date()
        data.bites_stings.user_id = Number(userid);
        return this.repo.create(data);
    }
    async findAll() { return this.repo.findAll(); }

    async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return await this.repo.list(offset, limit, filters, hospital_id, start_date, end_date);
    }
    async findById(id: number) {
        const bites_stings = await this.repo.getBitesStingsById(id);
        const outcome = await this.repo.getBitesStingsOutcomeById(id);

        if (!bites_stings) return null;

        return {
            bites_stings,
            outcome
        };
    }
    async findByTriageId(id: number) {
        const bites_stings = await this.repo.getBitesStingsByTriageId(id);
        let outcome = null;

        if (!bites_stings) return null;
        outcome = await this.repo.getBitesStingsOutcomeById(bites_stings.id);

        return {
            bites_stings,
            outcome
        };
    }
    async update(id: number, data: any, userid: string) {
        // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
        if ('date_time_of_entry' in data.bites_stings) {
            delete data.bites_stings.date_time_of_entry;
        }
        if ('inserted_date' in data.bites_stings) {
            delete data.bites_stings.inserted_date;
        }
        if ('user_id' in data.bites_stings) {
            delete data.bites_stings.user_id;
        }
        if ('ref_form_id' in data.bites_stings) {
            delete data.bites_stings.ref_form_id;
        }
        if ('ref_id' in data.bites_stings) {
            delete data.bites_stings.ref_id;
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
        const RpoBiteTypeOfBiteSting = new LookupRepository(LkpBiteTypeOfBiteSting);
        const RpoBiteVenomousType = new LookupRepository(LkpBiteVenomousType);
        const RpoBiteSiteOfBiteSting = new LookupRepository(LkpBiteSiteOfBiteSting);
        const RpoBiteSymptomsPresentation = new LookupRepository(LkpBiteSymptomsPresentation);
        const RpoBiteTimeInterval = new LookupRepository(LkpBiteTimeInterval);
        const RpoBiteSupportiveCareProvided = new LookupRepository(LkpBiteSupportiveCareProvided);
        const RpoBiteTypeOfOrganism = new LookupRepository(LkpBiteTypeOfOrganism);
        const RpoBiteOutcome = new LookupRepository(LkpBiteOutcome);
        const RpoPoisonOhHospitalType = new LookupRepository(LkpHospitalType);
        const RpoPoisonOhDestinationHospital = new LookupRepository(LkpDestinationHospital);
        const RpoPoisonOhReasonForReferral = new LookupRepository(LkpReasonForReferral);
        const RpoPoisonOhConditionOfPatient = new LookupRepository(LkpConditionOfPatient);

        const TypeOfBiteSting = await RpoBiteTypeOfBiteSting.getAll();
        const VenomousType = await RpoBiteVenomousType.getAll();
        const SiteOfBiteSting = await RpoBiteSiteOfBiteSting.getAll();
        const SymptomsPresentation = await RpoBiteSymptomsPresentation.getAll();
        const TimeInterval = await RpoBiteTimeInterval.getAll();
        const SupportiveCareProvided = await RpoBiteSupportiveCareProvided.getAll();
        const TypeOfOrganism = await RpoBiteTypeOfOrganism.getAll();
        const Outcome = await RpoBiteOutcome.getAll();
        const HospitalType = await RpoPoisonOhHospitalType.getAll();
        const DestinationHospital = await RpoPoisonOhDestinationHospital.getAll();
        const ReasonForReferral = await RpoPoisonOhReasonForReferral.getAll();
        const ConditionOfPatient = await RpoPoisonOhConditionOfPatient.getAll();

        return {
            TypeOfBiteSting
            , VenomousType
            , SiteOfBiteSting
            , SymptomsPresentation
            , TimeInterval
            , SupportiveCareProvided
            , TypeOfOrganism
            , Outcome
            , HospitalType
            , DestinationHospital
            , ReasonForReferral
            , ConditionOfPatient
        }
    }
}
