import { to, ReE, ReS, TE } from '../utils/util.service';
import { UserReviewSuggestionTag } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { getAll } from './baseController';

export const getAllUserReviewSuggestionTag = getAll(UserReviewSuggestionTag);
