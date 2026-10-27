import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
  ForeignKey
} from 'sequelize-typescript';

// Factory for simple lookup tables
function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class LookupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({
      type: DataType.STRING(256),
      allowNull: false
    })
    name!: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_enabled!: boolean;
  }
  return LookupModel;
}

// ====== Lookup Models ======

// Simple lookups
export const LkpBiteTypeOfBiteSting = createLookupModel('lkp_bite_type_of_bite_sting');
export const LkpBiteVenomousType = createLookupModel('lkp_bite_venomous_type');
export const LkpBiteSiteOfBiteSting = createLookupModel('lkp_bite_site_of_bite_sting');
export const LkpBiteSymptomsPresentation = createLookupModel('lkp_bite_symptoms_presentation');
export const LkpBiteTimeInterval = createLookupModel('lkp_bite_time_interval');
export const LkpBiteSupportiveCareProvided = createLookupModel('lkp_bite_supportive_care_provided');
export const LkpBiteOutcome = createLookupModel('lkp_bite_outcome');

// Special case: organism has a foreign key to type_of_bite_sting
@Table({ tableName: 'lkp_bite_type_of_organism', timestamps: false })
export class LkpBiteTypeOfOrganism extends Model<LkpBiteTypeOfOrganism> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @ForeignKey(() => LkpBiteTypeOfBiteSting)
  @Column(DataType.INTEGER)
  type_of_bite_sting_id!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}
