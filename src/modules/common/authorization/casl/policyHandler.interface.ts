
import { AppAbility, Subjects } from './casl-ability.factory';
import { Action } from './action.enum';

// type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = [Action, Subjects];
