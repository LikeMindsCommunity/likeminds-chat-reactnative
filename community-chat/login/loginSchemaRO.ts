import Realm from 'realm';

export class LoginSchemaRO extends Realm.Object<LoginSchemaRO> {
  id!: string;
  userUniqueID!: string;
  userName!: string;
  apiKey!: string;

  static schema = {
    name: 'LoginSchemaRO',
    properties: {
      id: 'string',
      userUniqueID: 'string',
      userName: 'string',
      apiKey: 'string',
    },
    primaryKey: 'id',
  };
}
