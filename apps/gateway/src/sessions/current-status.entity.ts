import { Risk } from './risk.enum';

export class CurrentStatusEntity {
  numberOfEncounters: number;

  lastEncounter?: Date;

  risk: Risk;

  updatedAt: Date;
}
