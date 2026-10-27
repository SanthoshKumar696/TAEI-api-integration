import { Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types/model';

export class LookupRepository<T extends Model> {
  constructor(private model: { findAll(options?: FindOptions): Promise<T[]> }) { }

  async getAll(
    enabledOnly = true,
    excludeFields: string[] = ['is_enabled']
  ): Promise<T[]> {
    const options: FindOptions = {
      attributes: { exclude: excludeFields },
      order: [['id', 'ASC']],
    };

    if (enabledOnly) {
      options.where = { is_enabled: true };
    }

    return this.model.findAll(options);
  }

  async getHospitals(): Promise<T[]> {
    return this.model.findAll(
      // {
      //   attributes: [
      //     ['hospitalid', 'id']
      //     , ['hospitalname', 'name']
      //     //, ['mainhospitaltype', 'maintype']
      //     , ['hospitalname108', 'name108']
      //     //, ['hospitaltype', 'type']
      //     , 'institution_code'
      //     //, ['district_id', 'distId']
      //     ]
      // }
    );
  }
}