import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Default } from 'sequelize-typescript';

// Factory function to generate lookup models
function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class LookupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING(256))
    name!: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_enabled!: boolean;
  }
  return LookupModel;
}

// Export individual models
export const LkpHangingNatureOfIncident = createLookupModel('lkp_hanging_nature_of_incident');
export const LkpHangingSuspensionOfBody = createLookupModel('lkp_hanging_suspension_of_body');
export const LkpHangingMaterialsUsed = createLookupModel('lkp_hanging_materials_used');
export const LkpHangingSymptomsPresentation = createLookupModel('lkp_hanging_symptoms_presentation');
export const LkpHangingInterventions = createLookupModel('lkp_hanging_interventions');
export const LkpHangingSupportiveCareProvided = createLookupModel('lkp_hanging_supportive_care_provided');
export const LkpHangingOutcome = createLookupModel('lkp_hanging_outcome');
