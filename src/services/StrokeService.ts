import { getISTDate } from "../utils/formatDateToLocalString";
import {
    LkpStrokeArrivalTimeSymptoms, LkpStrokeReasonForDelay, LkpStrokeReferredFrom, LkpStrokeReasonForReferral, LkpStrokeSymptoms, LkpStrokeAbsoluteContraindication,
    LkpStrokeNihsScale, LkpStrokeMriScanWakeupStroke, LkpStrokeType, LkpStrokeThrombolysisByDrug,
    LkpStrokeOutcome,
    LkpStrokeTransferredTo
} from '../models/lookup/LkpStrokeModel';
import { LookupRepository } from '../repositories/LookupRepository';
import { Stroke } from '../models/Stroke';
import { StrokeRepository } from '../repositories/StrokeRepository';
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';
import { LkpTriageSceneIft } from '../models/lookup/LkpTriageModels';

export class StrokeService {
    private repo: StrokeRepository;

    constructor() {
        this.repo = new StrokeRepository();
    }

    async create(data: any, userid: string): Promise<Stroke> {
        data.stroke.inserted_date = getISTDate();//new Date()
        data.stroke.user_id = Number(userid);
        return await this.repo.create(data);
    }

    async getAll(): Promise<Stroke[]> {
        return await this.repo.findAll();
    }

    async list(page: number, size: number, filters: any, hospital_id: number, start_date: string, end_date: string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return this.repo.list(offset, limit, filters, hospital_id, start_date, end_date);
    }

    async getById(id: number): Promise<any | null> {
        const stroke = await this.repo.getstrokeById(id);
        const outcome = await this.repo.getstrokeOutcomeById(id);

        if (!stroke) return null;

        return {
            stroke,
            outcome
        };
    }

    async update(id: number, data: any, userid: string): Promise<any | null> {
        // Remove date_time_of_entry, insert date and user id if included in request body, it should not update again
        if ('date_time_of_entry' in data.stroke) {
            delete data.stroke.date_time_of_entry;
        }
        if ('inserted_date' in data.stroke) {
            delete data.stroke.inserted_date;
        }
        if ('user_id' in data.stroke) {
            delete data.stroke.user_id;
        }
        if ('ref_form_id' in data.stroke) {
            delete data.stroke.ref_form_id;
        }
        if ('ref_id' in data.stroke) {
            delete data.stroke.ref_id;
        }
        return await this.repo.update(id, data);
    }

    async delete(id: number): Promise<number> {
        return await this.repo.delete(id);
    }

    async getNonIndex(id: number) {
        const triageData = await this.repo.getNonIndex(id);
        const triage = triageData.data;
        return triage;
    }

    async getAllLookups() {
        const RpoStrokeArrivalTimeSymptoms = new LookupRepository(LkpStrokeArrivalTimeSymptoms);
        const RpoStrokeReasonForDelay = new LookupRepository(LkpStrokeReasonForDelay);
        const rpoSceneIft = new LookupRepository(LkpTriageSceneIft);
        const RpoStrokeReferredFrom = new LookupRepository(LkpStrokeReferredFrom);
        const RpoStrokeReasonForReferral = new LookupRepository(LkpStrokeReasonForReferral);
        const RpoStrokeSymptoms = new LookupRepository(LkpStrokeSymptoms);
        const RpoStrokeAbsoluteContraindication = new LookupRepository(LkpStrokeAbsoluteContraindication);
        const RpoStrokeNihsScale = new LookupRepository(LkpStrokeNihsScale);
        const RpoStrokeMriScanWakeupStroke = new LookupRepository(LkpStrokeMriScanWakeupStroke);
        const RpoStrokeType = new LookupRepository(LkpStrokeType);
        const RpoStrokeThrombolysisByDrug = new LookupRepository(LkpStrokeThrombolysisByDrug);
        const RpoStrokeOutcome = new LookupRepository(LkpStrokeOutcome);
        const RpoStrokeTransferredTo = new LookupRepository(LkpStrokeTransferredTo);
        const RpoHospitalType = new LookupRepository(LkpHospitalType);
        const RpoDestinationHospital = new LookupRepository(LkpDestinationHospital);
        const RpoReasonForReferral = new LookupRepository(LkpReasonForReferral);
        const RpoConditionOfPatient = new LookupRepository(LkpConditionOfPatient);

        const ArrivalTimeSymptoms = await RpoStrokeArrivalTimeSymptoms.getAll();
        const ReasonForDelay = await RpoStrokeReasonForDelay.getAll();
        const SceneIft = await rpoSceneIft.getAll();
        const ReferredFrom = await RpoStrokeReferredFrom.getAll();
        const StrokeReasonForReferral = await RpoStrokeReasonForReferral.getAll();
        const Symptoms = await RpoStrokeSymptoms.getAll();
        const AbsoluteContraindication = await RpoStrokeAbsoluteContraindication.getAll();
        const NihsScale = await RpoStrokeNihsScale.getAll();
        const MriScanWakeupStroke = await RpoStrokeMriScanWakeupStroke.getAll();
        const Type = await RpoStrokeType.getAll();
        const ThrombolysisByDrug = await RpoStrokeThrombolysisByDrug.getAll();
        const Outcome = await RpoStrokeOutcome.getAll();
        const TransferredTo = await RpoStrokeTransferredTo.getAll();

        const HospitalType = await RpoHospitalType.getAll();
        const DestinationHospital = await RpoDestinationHospital.getAll();
        const ReasonForReferral = await RpoReasonForReferral.getAll();
        const ConditionOfPatient = await RpoConditionOfPatient.getAll();

        return {
            ArrivalTimeSymptoms
            , ReasonForDelay
            , SceneIft
            , ReferredFrom
            , StrokeReasonForReferral
            , Symptoms
            , AbsoluteContraindication
            , NihsScale
            , MriScanWakeupStroke
            , Type
            , ThrombolysisByDrug
            , Outcome
            , HospitalType
            , DestinationHospital
            , ReasonForReferral
            , ConditionOfPatient
        }
    }
}
