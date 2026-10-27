import { LookupAllRepository } from '../repositories/LookupAllRepository';
import { StemiRepository } from '../repositories/StemiRepository';

import { 
    LkpStemiCvRiskFactorMaster,
    LkpStemiFmcMaster,
    LkpStemiEcgLocationMaster,
    LkpStemiDiagnosisMaster,
    LkpStemiSignSymptom,
    LkpStemiInfarctionLocation,
    LkpStemiLoadingDoseLocation,
    LkpStemiLoadingDoseDrug,
    LkpStemiThrombolysisLocation,
    LkpStemiThrombolyticAgent,
    LkpStemiThrombolysisOutcome,
    LkpStemiTreatmentStrategy,
    LkpStemiConservativeManagement,
    LkpStemiKillipRiskScore,
    LkpStemiTransferLocation,
    LkpStemiPreDischargeCounselling,
    LkpStemiStentType,
    LkpStemiOutcomeType,
    LkpStemiDeathTiming,
    LkpStemiHospitalType,
    LkpStemiReferralReason,
    LkpStemiPatientCondition,
    LkpStemiNstemiLoadingDoseLocation,
    LkpStemiNstemiLoadingDoseDrug,
    LkpStemiTimiRiskScore,
    LkpStemiNstemiTreatmentStrategy,
    LkpStemiNstemiOutcomeType,
    LkpStemiNstemiDeathTiming,
    LkpStemiComplications,
    LkpStemiCathLabProcedure,
    LkpStemiCoronoryAngiograpy
} from '../models/lookup/LkpStemiModels';

import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from '../models/lookup/LkpCommonModel';
import { TriageService } from './TriageService';
const triagesr = new TriageService();
export const StemiService = {


    
    async create_op_patient(data: any) {
        return await StemiRepository.createstemiop(data);
    },
    async get_stemiop_by_id(data: any) {
        return await StemiRepository.get_stemiop_by_id(data);
    },
    async op_list(page: number, size: number, filters: any, hospital_id: number,start_date:string,end_date:string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return await StemiRepository.op_list(offset, limit, filters, hospital_id,start_date,end_date);
    },
    async create_stemi_full(data: any) {
        return await StemiRepository.create_stemi_full(data);
    },
    async get_stemi_all(id: number,patient_id:number) {
        return await StemiRepository.get_stemi_all(id,patient_id);
    },
    //Stemi admission
    async createStemiadmission(data: any) {
        return await StemiRepository.createStemiadmission(data);
    },

    async getAllStemiadmission() {
        return await StemiRepository.findAllStemiadmission();
    },

    async list(page: number, size: number, filters: any, hospital_id: number,start_date:string ,end_date :string) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        return await StemiRepository.list(offset, limit, filters, hospital_id,start_date,end_date);
    },

    async getByIdStemiadmission(id: number) {
        return await StemiRepository.findByIdStemiadmission(id);
    },

    async updateStemiadmission(id: number, data: any) {
        return await StemiRepository.updateStemiadmission(id, data);
    },

    async deleteStemiadmission(id: number) {
        return await StemiRepository.deleteStemiadmission(id);
    },

    //Stemi Clinical
    async create(data: any) {
        return await StemiRepository.create(data);
    },

    async getAll() {
        return await StemiRepository.findAll();
    },

    async getById(id: number) {
        return await StemiRepository.findById(id);
    },

    async update(id: number, data: any) {
        return await StemiRepository.update(id, data);
    },

    async delete(id: number) {
        return await StemiRepository.delete(id);
    },

    //Stemi Treatment
    async createStemiTreament(data: any) {
        return await StemiRepository.createStemiTreatment(data);
    },

    async getAllStemiTreament() {
        return await StemiRepository.findAllStemiTreatment();
    },

    async getByIdStemiTreament(id: number) {
        return await StemiRepository.findByIdStemiTreatment(id);
    },

    async updateStemiTreament(id: number, data: any) {
        return await StemiRepository.updateStemiTreatment(id, data);
    },

    async deleteStemiTreament(id: number) {
        return await StemiRepository.deleteStemiTreatment(id);
    },

    //Stemi Outcome
    async createStemiOutcome(data: any) {
        return await StemiRepository.createStemiOutcome(data);
    },

    async getAllStemiOutcome() {
        return await StemiRepository.findAllStemiOutcome();
    },

    async getByIdStemiOutcome(id: number) {
        return await StemiRepository.findByIdStemiOutcome(id);
    },

    async updateStemiOutcome(id: number, data: any) {
        return await StemiRepository.updateStemiOutcome(id, data);
    },

    async deleteStemiOutcome(id: number) {
        return await StemiRepository.deleteStemiOutcome(id);
    },

    //NStemi Treatment
    async createNStemiTreament(data: any) {
        return await StemiRepository.createNStemiTreatment(data);
    },

    async getAllNStemiTreament() {
        return await StemiRepository.findAllNStemiTreatment();
    },

    async getByIdNStemiTreament(id: number) {
        return await StemiRepository.findByIdNStemiTreatment(id);
    },

    async updateNStemiTreament(id: number, data: any) {
        return await StemiRepository.updateNStemiTreatment(id, data);
    },

    async deleteNStemiTreament(id: number) {
        return await StemiRepository.deleteNStemiTreatment(id);
    },

    //NStemi Outcome
    async createNStemiOutcome(data: any) {
        return await StemiRepository.createNStemiOutcome(data);
    },

    async getAllNStemiOutcome() {
        return await StemiRepository.findAllNStemiOutcome();
    },

    async getByIdNStemiOutcome(id: number) {
        return await StemiRepository.findByIdNStemiOutcome(id);
    },

    async updateNStemiOutcome(id: number, data: any) {
        return await StemiRepository.updateNStemiOutcome(id, data);
    },

    async deleteNStemiOutcome(id: number) {
        return await StemiRepository.deleteNStemiOutcome(id);
    },

    //Stemi Treatment
    async createAnginaTreament(data: any) {
        return await StemiRepository.createAnginaTreatment(data);
    },

    async getAllAnginaTreament() {
        return await StemiRepository.findAllAnginaTreatment();
    },

    async getByIdAnginaTreament(id: number) {
        return await StemiRepository.findByIdAnginaTreatment(id);
    },

    async updateAnginaTreament(id: number, data: any) {
        return await StemiRepository.updateAnginaTreatment(id, data);
    },

    async deleteAnginaTreament(id: number) {
        return await StemiRepository.deleteAnginaTreatment(id);
    },

    //Stemi Outcome
    async createAnginaOutcome(data: any) {
        return await StemiRepository.createAnginaOutcome(data);
    },

    async getAllAnginaOutcome() {
        return await StemiRepository.findAllAnginaOutcome();
    },

    async getByIdAnginaOutcome(id: number) {
        return await StemiRepository.findByIdAnginaOutcome(id);
    },

    async updateAnginaOutcome(id: number, data: any) {
        return await StemiRepository.updateAnginaOutcome(id, data);
    },

    async deleteAnginaOutcome(id: number) {
        return await StemiRepository.deleteAnginaOutcome(id);
    },

    async getAllLookups() {
        console.log('In all lookup STEMI');
    
        const RpoCvRiskFactor = new LookupAllRepository(LkpStemiCvRiskFactorMaster);
        const RpoFmc = new LookupAllRepository(LkpStemiFmcMaster);
        const RpoEcgLocation = new LookupAllRepository(LkpStemiEcgLocationMaster);
        const RpoDiagnosis = new LookupAllRepository(LkpStemiDiagnosisMaster);
        const RpoSignSymptom = new LookupAllRepository(LkpStemiSignSymptom);
    
        const RpoInfarctionLocation = new LookupAllRepository(LkpStemiInfarctionLocation);
        const RpoLoadingDoseLocation = new LookupAllRepository(LkpStemiLoadingDoseLocation);
        const RpoLoadingDoseDrug = new LookupAllRepository(LkpStemiLoadingDoseDrug);
        const RpoThrombolysisLocation = new LookupAllRepository(LkpStemiThrombolysisLocation);
        const RpoThrombolyticAgent = new LookupAllRepository(LkpStemiThrombolyticAgent);
        const RpoThrombolysisOutcome = new LookupAllRepository(LkpStemiThrombolysisOutcome);
        const RpoTreatmentStrategy = new LookupAllRepository(LkpStemiTreatmentStrategy);
        const RpoConservativeManagement = new LookupAllRepository(LkpStemiConservativeManagement);
        const RpoKillipRiskScore = new LookupAllRepository(LkpStemiKillipRiskScore);
        const RpoTransferLocation = new LookupAllRepository(LkpStemiTransferLocation);
        const RpoPreDischargeCounselling = new LookupAllRepository(LkpStemiPreDischargeCounselling);
        const RpoStentType = new LookupAllRepository(LkpStemiStentType);
        const RpoOutcomeType = new LookupAllRepository(LkpStemiOutcomeType);
        const RpoDeathTiming = new LookupAllRepository(LkpStemiDeathTiming);
        const RpoHospitalType = new LookupAllRepository(LkpStemiHospitalType);
        const RpoReferralReason = new LookupAllRepository(LkpStemiReferralReason);
        const RpoPatientCondition = new LookupAllRepository(LkpStemiPatientCondition);
    
        const RpoNstemiLoadingDoseLocation = new LookupAllRepository(LkpStemiNstemiLoadingDoseLocation);
        const RpoNstemiLoadingDoseDrug = new LookupAllRepository(LkpStemiNstemiLoadingDoseDrug);
        const RpoTimiRiskScore = new LookupAllRepository(LkpStemiTimiRiskScore);
        const RpoNstemiTreatmentStrategy = new LookupAllRepository(LkpStemiNstemiTreatmentStrategy);
        const RpoNstemiOutcomeType = new LookupAllRepository(LkpStemiNstemiOutcomeType);
        const RpoNstemiDeathTiming = new LookupAllRepository(LkpStemiNstemiDeathTiming);
        const RpoLkpStemiComplications = new LookupAllRepository(LkpStemiComplications);
        const RpoLkpStemiCathLabProcedure = new LookupAllRepository(LkpStemiCathLabProcedure);

        const RpoLkpStemiCoronoryAngiograpy = new LookupAllRepository(LkpStemiCoronoryAngiograpy);



        //const Rpo
    
        const CvRiskFactor = await RpoCvRiskFactor.getAll();
        const Fmc = await RpoFmc.getAll();
        const EcgLocation = await RpoEcgLocation.getAll();
        const Diagnosis = await RpoDiagnosis.getAll();
        const SignSymptom = await RpoSignSymptom.getAll();
    
        const InfarctionLocation = await RpoInfarctionLocation.getAll();
        const LoadingDoseLocation = await RpoLoadingDoseLocation.getAll();
        const LoadingDoseDrug = await RpoLoadingDoseDrug.getAll();
        const ThrombolysisLocation = await RpoThrombolysisLocation.getAll();
        const ThrombolyticAgent = await RpoThrombolyticAgent.getAll();
        const ThrombolysisOutcome = await RpoThrombolysisOutcome.getAll();
        const TreatmentStrategy = await RpoTreatmentStrategy.getAll();
        const ConservativeManagement = await RpoConservativeManagement.getAll();
        const KillipRiskScore = await RpoKillipRiskScore.getAll();
        const TransferLocation = await RpoTransferLocation.getAll();
        const PreDischargeCounselling = await RpoPreDischargeCounselling.getAll();
        const StentType = await RpoStentType.getAll();
        const StemiComplications = await RpoLkpStemiComplications.getAll();
        const OutcomeType = await RpoOutcomeType.getAll();
        const DeathTiming = await RpoDeathTiming.getAll();
        const HospitalType = await RpoHospitalType.getAll();
        const ReferralReason = await RpoReferralReason.getAll();
        const PatientCondition = await RpoPatientCondition.getAll();
    
        const NstemiLoadingDoseLocation = await RpoNstemiLoadingDoseLocation.getAll();
        const NstemiLoadingDoseDrug = await RpoNstemiLoadingDoseDrug.getAll();
        const TimiRiskScore = await RpoTimiRiskScore.getAll();
        const NstemiTreatmentStrategy = await RpoNstemiTreatmentStrategy.getAll();
        const NstemiOutcomeType = await RpoNstemiOutcomeType.getAll();
        const NstemiDeathTiming = await RpoNstemiDeathTiming.getAll();
        const StemiCathLabProcedure = await RpoLkpStemiCathLabProcedure.getAll();
        
        const StemiCoronoryAngiograpy = await RpoLkpStemiCoronoryAngiograpy.getAll();
        

        const triage_response= await triagesr.getAllLookups()
        
        

        const agelist=[{"id":1,"name":"<1"},{"id":2,"name":"1-18"},{"id":3,"name":"19-120"},{"id":4,"name":"120 & above"}];
        const ehr_id=[{"id":true,"name":"Yes"},{"id":false,"name":"No"}];
        return {
            CvRiskFactor,
            Fmc,
            EcgLocation,
            Diagnosis,
            SignSymptom,
            InfarctionLocation,
            LoadingDoseLocation,
            LoadingDoseDrug,
            ThrombolysisLocation,
            ThrombolyticAgent,
            ThrombolysisOutcome,
            TreatmentStrategy,
            ConservativeManagement,
            KillipRiskScore,
            TransferLocation,
            PreDischargeCounselling,
            StentType,
            StemiComplications,
            OutcomeType,
            DeathTiming,
            HospitalType,
            ReferralReason,
            PatientCondition,
            NstemiLoadingDoseLocation,
            NstemiLoadingDoseDrug,
            TimiRiskScore,
            NstemiTreatmentStrategy,
            NstemiOutcomeType,
            NstemiDeathTiming,
            agelist,
            ehr_id,
            StemiCathLabProcedure,
            StemiCoronoryAngiograpy,
            triage_response
        };
    },
    async getNonIndex(id: number) {
        const triageData = await StemiRepository.getNonIndex(id);
        const triage = triageData.data;
        return triage;
    },
    async getNonIndexOP(id: number) {
        const triageData = await StemiRepository.getNonIndexOP(id);
        const triage = triageData.data;
        return triage;
    }
    
    
};
