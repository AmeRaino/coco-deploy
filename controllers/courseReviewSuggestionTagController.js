import { to, ReE, ReS, TE } from '../utils/util.service';
import { CourseReviewSuggestionTag } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { getAll } from './baseController';

export const getAllCourseReviewSuggestionTag = getAll(CourseReviewSuggestionTag);
