import { getISTDate } from "../utils/formatDateToLocalString";
import { LookupRepository } from '../repositories/LookupRepository';
import { BurnsRepository } from '../repositories/BurnsRepository';
import {
    LkpBurnsTypeOfBurn, LkpBurnsModeOfInjury, LkpBurnsPlaceOfIncident, LkpBurnsTbsa, LkpBurnsDegreeOfBurn, LkpBurnsCoMorbidities, LkpBurnsWoundManagement,
    LkpBurnsConservative, LkpBurnsSurgeryEmergency, LkpBurnsSurgeryElective, LkpBurnsSupportiveMeasures, LkpBurnsStayComplications, LkpBurnsMultidisciplinarySupport,
    LkpBurnsNoOfHospitalStay, LkpBurnsOutcome, LkpBurnsTransferredTo
} from '../models/lookup/LkpBurnsModel';
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';

export const BurnsService = {
    async create(data: any, userid: string) {
        data.burns.inserted_date = getISTDate();//new Date()
        data.burns.user_id = Number(userid);
        return await BurnsRepository.create(data);
    },

    async getAll() {
        return await BurnsRepository.findAll();
    },

    async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return await BurnsRepository.list(offset, limit, filters, hospital_id, start_date, end_date);
    },

    async getById(id: number) {
        const burns = await BurnsRepository.getBurnsById(id);
        const burns_values = await BurnsRepository.getBurnsValuesById(id);
        const burns_outcome = await BurnsRepository.getBurnsOutcomeById(id);
        const burns_tbsa = await BurnsRepository.getBurnsTbsaById(id);
        const burns_surgery_elective = await BurnsRepository.getBurnsSurgeryElectiveById(id);

        if (!burns) return null;

        return {
            burns,
            burns_values,
            burns_tbsa,
            burns_outcome,
            burns_surgery_elective
        };
    },

    async getByTriageId(id: number) {
        const burns = await BurnsRepository.getBurnsByTriageId(id);
        let burns_values = null;
        let burns_outcome = null;
        let burns_tbsa = null;
        let burns_surgery_elective = null;

        if (!burns) return null;

        burns_values = await BurnsRepository.getBurnsValuesById(burns.id);
        burns_outcome = await BurnsRepository.getBurnsOutcomeById(burns.id);
        burns_tbsa = await BurnsRepository.getBurnsTbsaById(burns.id);
        burns_surgery_elective = await BurnsRepository.getBurnsSurgeryElectiveById(burns.id);

        return {
            burns,
            burns_values,
            burns_tbsa,
            burns_outcome,
            burns_surgery_elective
        };
    },

    async update(id: number, data: any, userid: string) {
        // Remove admission_date, insert date and user id if included in request body, it should not update again
        if ('admission_date' in data.burns) {
            delete data.burns.admission_date;
        }
        if ('inserted_date' in data.burns) {
            delete data.burns.inserted_date;
        }
        if ('user_id' in data.burns) {
            delete data.burns.user_id;
        }
        if ('ref_form_id' in data.burns) {
            delete data.burns.ref_form_id;
        }
        if ('ref_id' in data.burns) {
            delete data.burns.ref_id;
        }
        return await BurnsRepository.update(id, data);
    },

    async delete(id: number) {
        return await BurnsRepository.delete(id);
    },

    async getNonIndex(id: number) {
        const burnsData = await BurnsRepository.getNonIndex(id);
        const burns = burnsData.data;
        return burns;
    },

    async getAllLookups() {
        console.log('in all lookuo Burns');
        const RpoTypeOfBurn = new LookupRepository(LkpBurnsTypeOfBurn);
        const RpoModeOfInjury = new LookupRepository(LkpBurnsModeOfInjury);
        const RpoPlaceOfIncident = new LookupRepository(LkpBurnsPlaceOfIncident);
        const RpoTbsa = new LookupRepository(LkpBurnsTbsa);
        const RpoDegreeOfBurn = new LookupRepository(LkpBurnsDegreeOfBurn);
        const RpoCoMorbidities = new LookupRepository(LkpBurnsCoMorbidities);
        const RpoWoundManagement = new LookupRepository(LkpBurnsWoundManagement);
        const RpoConservative = new LookupRepository(LkpBurnsConservative);
        const RpoSurgeryEmergency = new LookupRepository(LkpBurnsSurgeryEmergency);
        const RpoSurgeryElective = new LookupRepository(LkpBurnsSurgeryElective);
        const RpoSupportiveMeasures = new LookupRepository(LkpBurnsSupportiveMeasures);
        const RpoStayComplications = new LookupRepository(LkpBurnsStayComplications);
        const RpoMultidisciplinarySupport = new LookupRepository(LkpBurnsMultidisciplinarySupport);
        const RpoNoOfHospitalStay = new LookupRepository(LkpBurnsNoOfHospitalStay);
        const RpoOutcome = new LookupRepository(LkpBurnsOutcome);
        const RpoTransferredTo = new LookupRepository(LkpBurnsTransferredTo);
        const RpoHospitalType = new LookupRepository(LkpHospitalType);
        const RpoDestinationHospital = new LookupRepository(LkpDestinationHospital);
        const RpoReasonForReferral = new LookupRepository(LkpReasonForReferral);
        const RpoConditionOfPatient = new LookupRepository(LkpConditionOfPatient);

        const TypeOfBurn = await RpoTypeOfBurn.getAll();
        const ModeOfInjury = await RpoModeOfInjury.getAll();
        const PlaceOfIncident = await RpoPlaceOfIncident.getAll();
        const Tbsa = await RpoTbsa.getAll();
        const DegreeOfBurn = await RpoDegreeOfBurn.getAll();
        const CoMorbidities = await RpoCoMorbidities.getAll();
        const WoundManagement = await RpoWoundManagement.getAll();
        const Conservative = await RpoConservative.getAll();
        const SurgeryEmergency = await RpoSurgeryEmergency.getAll();
        const SurgeryElective = await RpoSurgeryElective.getAll();
        const SupportiveMeasures = await RpoSupportiveMeasures.getAll();
        const StayComplications = await RpoStayComplications.getAll();
        const MultidisciplinarySupport = await RpoMultidisciplinarySupport.getAll();
        const NoOfHospitalStay = await RpoNoOfHospitalStay.getAll();
        const Outcome = await RpoOutcome.getAll();
        const TransferredTo = await RpoTransferredTo.getAll();
        const HospitalType = await RpoHospitalType.getAll();
        const DestinationHospital = await RpoDestinationHospital.getAll();
        const ReasonForReferral = await RpoReasonForReferral.getAll();
        const ConditionOfPatient = await RpoConditionOfPatient.getAll();

        return {
            TypeOfBurn
            , ModeOfInjury
            , PlaceOfIncident
            , Tbsa
            , DegreeOfBurn
            , CoMorbidities
            , WoundManagement
            , Conservative
            , SurgeryEmergency
            , SurgeryElective
            , SupportiveMeasures
            , StayComplications
            , MultidisciplinarySupport
            , NoOfHospitalStay
            , Outcome
            , TransferredTo
            , HospitalType
            , DestinationHospital
            , ReasonForReferral
            , ConditionOfPatient
        }
    },
};
