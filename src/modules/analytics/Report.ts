import moment from 'moment';
import { Category } from './Category';
import { Day } from './Day';
import { Filter } from './Filter';
import { Month } from './Month';
import { By, GroupValue, Product, Profile, SingleValue } from './Result';
import { Audience } from './Audience';

/**
 * Gets profile information.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Profile information
 * ``` typescript
 * // example call
 * getProfile({}, 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   traffic: 200,
 *   views: 120,
 *   dwell: 50,
 *   attention: 10,
 *   gender: [
 *     { label: 'Male', value: 50 },
 *     { label: 'Female', value: 50 }
 *   ]
 *   age: [
 *     { label: 'Children (0-20)', value: 50 },
 *     { label: 'Young (21-40)', value: 70 },
 *     { label: 'Middle Age (41-60)', value: 40 },
 *     { label: 'Elder (61-99)', value: 10 }
 *   ],
 *   emotion: [
 *     { label: 'Happy', value: 20 },
 *     { label: 'Neutral', value: 50 },
 *     { label: 'Sad', value: 5 },
 *     { label: 'Surprise', value: 15 },
 *     { label: 'Anger', value: 10 }
 *   ]
 * }
 * ```
 */
export const getProfile = async (filter: Filter, project: string, clientId: string, apiKey: string): Promise<Profile> => {
  const parsedFilter = parseFilter(filter);
  // TODO: check value format
  // traffic
  const traffic = await get('eventcount', { ...parsedFilter, ev_action: 'in', ev_category: 'profile' }, project, clientId, apiKey);
  // views
  const views = await get('eventcount', { ...parsedFilter, is_view: true, ev_action: 'out', ev_category: 'profile' }, project, clientId, apiKey);
  // genders
  let result = await get('split', { ...parsedFilter, _split: 'target_gender' }, project, clientId, apiKey);
  const labelsMap = new Map([ ['M', 'Male'], ['F', 'Female'] ]);
  const gender: SingleValue[] = [];
  for(let i = 0; i < result.split.length; i++) {
    gender.push({
      label: labelsMap.get(result.split[i].key),
      value: result.split[i].doc_count
    });
  }
  // ages
  const ageRanges = {
    _range1: '0-20', _range1_key: 'Children (0-20)',
    _range2: '21-40', _range2_key: 'Young (21-40)',
    _range3: '41-60', _range3_key: 'Middle Age (41-60)',
    _range4: '61-99', _range4_key: 'Elder (61-99)'
  };
  result = await get('ranges', { ...parsedFilter, ...ageRanges, _split: 'target_age' }, project, clientId, apiKey);
  const age: SingleValue[] = [
    { label: ageRanges._range1_key, value: result.split[ageRanges._range1_key].doc_count },
    { label: ageRanges._range2_key, value: result.split[ageRanges._range2_key].doc_count },
    { label: ageRanges._range3_key, value: result.split[ageRanges._range3_key].doc_count },
    { label: ageRanges._range4_key, value: result.split[ageRanges._range4_key].doc_count }
  ]
  // dwell
  const dwell = await get('average', { ...parsedFilter, _avgfield: 'target_dwell', ev_action: 'out', ev_category: 'profile' }, project, clientId, apiKey);
  // attention
  const attention = await get('average', { ...parsedFilter, _avgfield: 'target_attention', ev_action: 'out', ev_category: 'profile' }, project, clientId, apiKey);
  // emotion
  result = await get('split', { ...parsedFilter, _split: 'target_dominant_emotion' }, project, clientId, apiKey);
  const emotion: SingleValue[] = [];
  for(let i = 0; i < result.split.length; i++) {
    emotion.push({ label: result.split[i].key, value: result.split[i].doc_count });
  }
  return { traffic, views, gender, age, dwell, attention, emotion };
}

/**
 * Gets product information
 * @param filter Options to narrow down the result.
 * @param categories Studio categories.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Product information (interactions, interaction time, most interacted and product distribution).
 * ``` typescript
 * // example call
 * getProduct({}, ['marker'], 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   interactions: 100,
 *   interactionTime: 5,
 *   mostInteracted: "1",
 *   productDistribution: [
 *     { label: "1", value: 45 },
 *     { label: "2", value: 30 },
 *     { label: "3", value: 25 },
 *   ]
 * }
 * ```
 */
export const getProduct = async (filter: Filter, categories: string[], project: string, clientId: string, apiKey: string): Promise<Product> => {
  const parsedFilter = parseFilter(filter);
  // TODO: check value format
  // interactions
  const c = categories.filter(c => c === Category.Sensor || c === Category.Marker);
  const category = c.join('|');
  const interactions = await get('eventcount', { ...parsedFilter, ev_category: category, ev_action: 'in' }, project, clientId, apiKey);
  // interaction time
  const interactionTime = await get('average', { ...parsedFilter, ev_category: category, _avgfield: 'target_attention_time', ev_action: 'out' }, project, clientId, apiKey);
  // most interacted
  const mostInteracted = await get('topcount', { ...parsedFilter, ev_category: category, ev_action: 'in' }, project, clientId, apiKey);
  // product distribution
  let result = await get('split', { ...parsedFilter, ev_category: category, _split: 'audience_id', _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'in' }, project, clientId, apiKey);
  const productDistribution: SingleValue[] = [];
  for(let i = 0; i < result.split.length; i++) {
    productDistribution.push({ label: result.split[i].key, value: result.split[i].doc_count });
  }
  return { interactions, interactionTime, mostInteracted, productDistribution };
}

/**
 * Gets information grouped by year.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Information grouped by year (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example call
 * getByYear({}, 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   traffic: [
 *     { label: "2022", value: 200 },
 *     { label: "2023", value: 250 }
 *   ],
 *   views: [
 *     { label: "2022", value: 100 },
 *     { label: "2023", value: 150 }
 *   ],
 *   dwell: [
 *     { label: "2022", value: 150 },
 *     { label: "2023", value: 170 }
 *   ],
 *   attention: [
 *     { label: "2022", value: 20 },
 *     { label: "2023", value: 25 }
 *   ],
 *   liftInteractions: [
 *     { label: "2022", value: 30 },
 *     { label: "2023", value: 35 }
 *   ],
 *   liftTime: [
 *     { label: "2022", value: 10 },
 *     { label: "2023", value: 15 }
 *   ],
 *   placeInteractions: [
 *     { label: "2022", value: 30 },
 *     { label: "2023", value: 35 }
 *   ],
 *   placeTime: [
 *     { label: "2022", value: 10 },
 *     { label: "2023", value: 15 }
 *   ],
 *   gender: [
 *     { 
 *       label: "2022", value: [
 *         { label: "Male", 50 },
 *         { label: "Female", 50 }
 *       ]
 *     },
 *     { 
 *       label: "2023", value: [
 *         { label: "Male", 55 },
 *         { label: "Female", 55 }
 *       ]
 *     }
 *   ]
 *   age: [
 *     { 
 *       label: "2022", value: [
 *         { label: 'Children (0-20)', value: 50 },
 *         { label: 'Young (21-40)', value: 70 },
 *         { label: 'Middle Age (41-60)', value: 40 },
 *         { label: 'Elder (61-99)', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "2023", value: [
 *         { label: 'Children (0-20)', value: 55 },
 *         { label: 'Young (21-40)', value: 75 },
 *         { label: 'Middle Age (41-60)', value: 45 },
 *         { label: 'Elder (61-99)', value: 15 }
 *       ]
 *     }
 *   ],
 *   emotion: [
 *     { 
 *       label: "2022", value: [
 *         { label: 'Happy', value: 20 },
 *         { label: 'Neutral', value: 50 },
 *         { label: 'Sad', value: 5 },
 *         { label: 'Surprise', value: 15 },
 *         { label: 'Anger', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "2023", value: [
 *         { label: 'Happy', value: 25 },
 *         { label: 'Neutral', value: 55 },
 *         { label: 'Sad', value: 10 },
 *         { label: 'Surprise', value: 20 },
 *         { label: 'Anger', value: 15 }
 *       ]
 *     }
 *   ],
 *   productDistribution: [
 *     { 
 *       label: "2022", value: [
 *         { label: '1', value: 20 },
 *         { label: '2', value: 50 },
 *         { label: '3', value: 5 }
 *       ]
 *     },
 *     { 
 *       label: "2023", value: [
 *         { label: '1', value: 25 },
 *         { label: '2', value: 55 },
 *         { label: '3', value: 10 }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export const getByYear = async (filter: Filter, project: string, clientId: string, apiKey: string): Promise<By> => {
  const parsedFilter = parseFilter(filter);
  // gender
  let f = { ...parsedFilter, _split0: 'year', _split1: 'target_gender' };
  let result = await get('multisplit', f, project, clientId, apiKey);
  const genderMap = new Map<number, any>();
  for(let i = 0; i < result.split.length; i++) {
    const value = genderMap.get(result.split[i].key[0]) || { M: 0, F: 0 };
    value[result.split[i].key[1]] = result.split[i].doc_count;
    genderMap.set(result.split[i].key[0], value);
  }
  const gender: GroupValue[] = [];
  for(let [key, value] of genderMap) {
    gender.push({
      label: key.toString(),
      values: [{ label: 'Male', value: value.M }, { label: 'Female', value: value.F }]
    });
  }
  // age
  f = { ...parsedFilter, _field_term: 'year', _field_ranges: 'target_age', _range1: '0-20',_range1_key: 'r1', _range2: '21-40', _range2_key: 'r2', _range3: '41-60', _range3_key: 'r3', _range4: '61-99', _range4_key: 'r4' };
  result = await get('multisplit_range', f, project, clientId, apiKey);
  const ageMap = new Map<number, any>();
  for(let i = 0; i < result.split.length; i++) {
    const year = ageMap.get(result.split[i].key) || { name: result.split[i].key, r1: 0, r2: 0, r3: 0, r4: 0 };
    year.r1 = result.split[i].split.buckets['r1'].doc_count;
    year.r2 = result.split[i].split.buckets['r2'].doc_count;
    year.r3 = result.split[i].split.buckets['r3'].doc_count;
    year.r4 = result.split[i].split.buckets['r4'].doc_count;
    ageMap.set(result.split[i].key, year);
  }
  const age: GroupValue[] = [];
  for(let [key, value] of ageMap) {
    age.push({
      label: key.toString(),
      values: [{ label: f._range1_key, value: value.r1 }, { label: f._range2_key, value: value.r2 }, { label: f._range3_key, value: value.r3 }, { label: f._range4_key, value: value.r4 }]
    });
  }
  // product distribution
  f = { ...parsedFilter, _split0: 'year', _split1: 'audience_id', _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  result = await get('multisplit', f, project, clientId, apiKey);
  const productDistributionMap = new Map<number, any>();
  for(let i = 0; i < result.split.length; i++) {
    const value = productDistributionMap.get(result.split[i].key[0]) || {};
    value[result.split[i].key[1]] = result.split[i].avg.value;
    productDistributionMap.set(result.split[i].key[0], value);
  }
  const productDistribution: GroupValue[] = [];
  for(let [key, value] of productDistributionMap) {
    const groupValue: GroupValue = {
      label: key.toString(),
      values: []
    };
    for(let [k, v] of value) {
      groupValue.values.push({
        label: k.toString(),
        value: v
      })
    }
    productDistribution.push(groupValue);
  }
  const main = await by(splitByYear, filter, project, clientId, apiKey);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by month.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Information grouped by month (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example call
 * getByMonth({}, 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   traffic: [
 *     { label: "January", value: 200 },
 *     { label: "February", value: 250 }
 *   ],
 *   views: [
 *     { label: "January", value: 100 },
 *     { label: "February", value: 150 }
 *   ],
 *   dwell: [
 *     { label: "January", value: 150 },
 *     { label: "February", value: 170 }
 *   ],
 *   attention: [
 *     { label: "January", value: 20 },
 *     { label: "February", value: 25 }
 *   ],
 *   liftInteractions: [
 *     { label: "January", value: 30 },
 *     { label: "February", value: 35 }
 *   ],
 *   liftTime: [
 *     { label: "January", value: 10 },
 *     { label: "February", value: 15 }
 *   ],
 *   placeInteractions: [
 *     { label: "January", value: 30 },
 *     { label: "February", value: 35 }
 *   ],
 *   placeTime: [
 *     { label: "January", value: 10 },
 *     { label: "February", value: 15 }
 *   ],
 *   gender: [
 *     { 
 *       label: "January", value: [
 *         { label: "Male", 50 },
 *         { label: "Female", 50 }
 *       ]
 *     },
 *     { 
 *       label: "February", value: [
 *         { label: "Male", 55 },
 *         { label: "Female", 55 }
 *       ]
 *     }
 *   ]
 *   age: [
 *     { 
 *       label: "January", value: [
 *         { label: 'Children (0-20)', value: 50 },
 *         { label: 'Young (21-40)', value: 70 },
 *         { label: 'Middle Age (41-60)', value: 40 },
 *         { label: 'Elder (61-99)', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "February", value: [
 *         { label: 'Children (0-20)', value: 55 },
 *         { label: 'Young (21-40)', value: 75 },
 *         { label: 'Middle Age (41-60)', value: 45 },
 *         { label: 'Elder (61-99)', value: 15 }
 *       ]
 *     }
 *   ],
 *   emotion: [
 *     { 
 *       label: "January", value: [
 *         { label: 'Happy', value: 20 },
 *         { label: 'Neutral', value: 50 },
 *         { label: 'Sad', value: 5 },
 *         { label: 'Surprise', value: 15 },
 *         { label: 'Anger', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "February", value: [
 *         { label: 'Happy', value: 25 },
 *         { label: 'Neutral', value: 55 },
 *         { label: 'Sad', value: 10 },
 *         { label: 'Surprise', value: 20 },
 *         { label: 'Anger', value: 15 }
 *       ]
 *     }
 *   ],
 *   productDistribution: [
 *     { 
 *       label: "January", value: [
 *         { label: '1', value: 20 },
 *         { label: '2', value: 50 },
 *         { label: '3', value: 5 }
 *       ]
 *     },
 *     { 
 *       label: "February", value: [
 *         { label: '1', value: 25 },
 *         { label: '2', value: 55 },
 *         { label: '3', value: 10 }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export const getByMonth = async (filter: Filter, project: string, clientId: string, apiKey: string): Promise<By> => {
  const parsedFilter = parseFilter(filter);
  // gender
  const genderValues = new Map<string, any>();
  const ageValues = new Map<string, any>();
  const productDistributionValues = new Map<string, any>();
  let i = 1;
  Object.values(Month).filter(m => typeof m === 'string').forEach(m => {
    genderValues.set((i).toString(), { name: m.toString(), M: 0, F: 0 });
    ageValues.set((i).toString(), { name: m.toString(), r1: 0, r2: 0, r3: 0, r4: 0 });
    productDistributionValues.set((i++).toString(), { name: m.toString() });
  });
  const gender = await multisplitBy('month', 'target_gender', genderValues, parsedFilter, project, clientId, apiKey);
  const age = await ageBy('month', ageValues, parsedFilter, project, clientId, apiKey);
  const f = { ...parsedFilter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, apiKey);
  const main = await by(splitByMonth, parsedFilter, project, clientId, apiKey);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by week day.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Information grouped by week day (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example call
 * getByWeekday({}, 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   traffic: [
 *     { label: "Monday", value: 200 },
 *     { label: "Tuesday", value: 250 }
 *   ],
 *   views: [
 *     { label: "Monday", value: 100 },
 *     { label: "Tuesday", value: 150 }
 *   ],
 *   dwell: [
 *     { label: "Monday", value: 150 },
 *     { label: "Tuesday", value: 170 }
 *   ],
 *   attention: [
 *     { label: "Monday", value: 20 },
 *     { label: "Tuesday", value: 25 }
 *   ],
 *   liftInteractions: [
 *     { label: "Monday", value: 30 },
 *     { label: "Tuesday", value: 35 }
 *   ],
 *   liftTime: [
 *     { label: "Monday", value: 10 },
 *     { label: "Tuesday", value: 15 }
 *   ],
 *   placeInteractions: [
 *     { label: "Monday", value: 30 },
 *     { label: "Tuesday", value: 35 }
 *   ],
 *   placeTime: [
 *     { label: "Monday", value: 10 },
 *     { label: "Tuesday", value: 15 }
 *   ],
 *   gender: [
 *     { 
 *       label: "Monday", value: [
 *         { label: "Male", 50 },
 *         { label: "Female", 50 }
 *       ]
 *     },
 *     { 
 *       label: "Tuesday", value: [
 *         { label: "Male", 55 },
 *         { label: "Female", 55 }
 *       ]
 *     }
 *   ]
 *   age: [
 *     { 
 *       label: "Monday", value: [
 *         { label: 'Children (0-20)', value: 50 },
 *         { label: 'Young (21-40)', value: 70 },
 *         { label: 'Middle Age (41-60)', value: 40 },
 *         { label: 'Elder (61-99)', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "Tuesday", value: [
 *         { label: 'Children (0-20)', value: 55 },
 *         { label: 'Young (21-40)', value: 75 },
 *         { label: 'Middle Age (41-60)', value: 45 },
 *         { label: 'Elder (61-99)', value: 15 }
 *       ]
 *     }
 *   ],
 *   emotion: [
 *     { 
 *       label: "Monday", value: [
 *         { label: 'Happy', value: 20 },
 *         { label: 'Neutral', value: 50 },
 *         { label: 'Sad', value: 5 },
 *         { label: 'Surprise', value: 15 },
 *         { label: 'Anger', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "Tuesday", value: [
 *         { label: 'Happy', value: 25 },
 *         { label: 'Neutral', value: 55 },
 *         { label: 'Sad', value: 10 },
 *         { label: 'Surprise', value: 20 },
 *         { label: 'Anger', value: 15 }
 *       ]
 *     }
 *   ],
 *   productDistribution: [
 *     { 
 *       label: "Monday", value: [
 *         { label: '1', value: 20 },
 *         { label: '2', value: 50 },
 *         { label: '3', value: 5 }
 *       ]
 *     },
 *     { 
 *       label: "Tuesday", value: [
 *         { label: '1', value: 25 },
 *         { label: '2', value: 55 },
 *         { label: '3', value: 10 }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export const getByWeekday = async (filter: any, project: string, clientId: string, apiKey: string): Promise<By> => {
  const parsedFilter = parseFilter(filter);
  // gender
  const genderValues = new Map<string, any>();
  const ageValues = new Map<string, any>();
  const productDistributionValues = new Map<string, any>();
  let i = 1;
  Object.values(Day).filter(m => typeof m === 'string').forEach(m => {
    genderValues.set((i).toString(), { name: m.toString(), M: 0, F: 0 });
    ageValues.set((i).toString(), { name: m.toString(), r1: 0, r2: 0, r3: 0, r4: 0 });
    productDistributionValues.set((i++).toString(), { name: m.toString() });
  });
  const gender = await multisplitBy('weekday', 'target_gender', genderValues, parsedFilter, project, clientId, apiKey);
  const age = await ageBy('weekday', ageValues, parsedFilter, project, clientId, apiKey);
  const f = { ...filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, apiKey);
  const main = await by(splitByWeekday, parsedFilter, project, clientId, apiKey);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by hour.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Information grouped by hour (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example call
 * getByHour({}, 'broox-studio-development', clientId, apiKey).then(result => {...
 * // example result
 * {
 *   traffic: [
 *     { label: "10", value: 200 },
 *     { label: "11", value: 250 }
 *   ],
 *   views: [
 *     { label: "10", value: 100 },
 *     { label: "11", value: 150 }
 *   ],
 *   dwell: [
 *     { label: "10", value: 150 },
 *     { label: "11", value: 170 }
 *   ],
 *   attention: [
 *     { label: "10", value: 20 },
 *     { label: "11", value: 25 }
 *   ],
 *   liftInteractions: [
 *     { label: "10", value: 30 },
 *     { label: "11", value: 35 }
 *   ],
 *   liftTime: [
 *     { label: "10", value: 10 },
 *     { label: "11", value: 15 }
 *   ],
 *   placeInteractions: [
 *     { label: "10", value: 30 },
 *     { label: "11", value: 35 }
 *   ],
 *   placeTime: [
 *     { label: "10", value: 10 },
 *     { label: "11", value: 15 }
 *   ],
 *   gender: [
 *     { 
 *       label: "10", value: [
 *         { label: "Male", 50 },
 *         { label: "Female", 50 }
 *       ]
 *     },
 *     { 
 *       label: "11", value: [
 *         { label: "Male", 55 },
 *         { label: "Female", 55 }
 *       ]
 *     }
 *   ]
 *   age: [
 *     { 
 *       label: "10", value: [
 *         { label: 'Children (0-20)', value: 50 },
 *         { label: 'Young (21-40)', value: 70 },
 *         { label: 'Middle Age (41-60)', value: 40 },
 *         { label: 'Elder (61-99)', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "11", value: [
 *         { label: 'Children (0-20)', value: 55 },
 *         { label: 'Young (21-40)', value: 75 },
 *         { label: 'Middle Age (41-60)', value: 45 },
 *         { label: 'Elder (61-99)', value: 15 }
 *       ]
 *     }
 *   ],
 *   emotion: [
 *     { 
 *       label: "10", value: [
 *         { label: 'Happy', value: 20 },
 *         { label: 'Neutral', value: 50 },
 *         { label: 'Sad', value: 5 },
 *         { label: 'Surprise', value: 15 },
 *         { label: 'Anger', value: 10 }
 *       ]
 *     },
 *     { 
 *       label: "11", value: [
 *         { label: 'Happy', value: 25 },
 *         { label: 'Neutral', value: 55 },
 *         { label: 'Sad', value: 10 },
 *         { label: 'Surprise', value: 20 },
 *         { label: 'Anger', value: 15 }
 *       ]
 *     }
 *   ],
 *   productDistribution: [
 *     { 
 *       label: "10", value: [
 *         { label: '1', value: 20 },
 *         { label: '2', value: 50 },
 *         { label: '3', value: 5 }
 *       ]
 *     },
 *     { 
 *       label: "11", value: [
 *         { label: '1', value: 25 },
 *         { label: '2', value: 55 },
 *         { label: '3', value: 10 }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export const getByHour = async (filter: any, project: string, clientId: string, apiKey: string): Promise<By> => {
  const parsedFilter = parseFilter(filter);
  // gender
  const genderValues = new Map<string, any>();
  const ageValues = new Map<string, any>();
  const productDistributionValues = new Map<string, any>();
  for(let i = 0; i < 24; i++) {
    const n = i.toString().padStart(2, '0');
    genderValues.set((n).toString(), { M: 0, F: 0 });
    ageValues.set((n).toString(), { r1: 0, r2: 0, r3: 0, r4: 0 });
    productDistributionValues.set((n).toString(), {});
  }
  const gender = await multisplitBy('hour', 'target_gender', genderValues, parsedFilter, project, clientId, apiKey);
  const age = await ageBy('hour', ageValues, parsedFilter, project, clientId, apiKey);
  const f = { ...filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('hour', 'audience_id', productDistributionValues, f, project, clientId, apiKey);
  const main = await by(splitByHour, parsedFilter, project, clientId, apiKey);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets client information.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Client information.
 * ``` typescript
 * // example
 * getClient({}, 'broox-studio-development', clientId, apiKey).then(result => {
 *   console.log('client', result);
 * }
 * ```
 */
export const getClient = async (project: string, clientId: string, apiKey: string) => {
  const result = await fetch(getUrl(project) + '/clientmeta/' + clientId, getOptions(apiKey));
  return result.json();
}

/**
 * Gets audiences.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Audiences.
 * ``` typescript
 * // example call
 * getAudiences({}, 'broox-studio-development', clientId, apiKey).then(...
 * // example result
 * [
 *   { name: "Smartwatch S1", id: "1" },
 *   { name: "MI Band 7 PRO", id: "2" },
 *   { name: "Smart Band 7", id: "3" },
 * ]
 * ```
 */
export const getAudiences = async (filter: Filter, project: string, clientId: string, apiKey: string): Promise<Audience[]> => {
  const parsedFilter = parseFilter(filter);
  const audiences: Audience[] = [];
  const a = await get('audiences', parsedFilter, project, clientId, apiKey);
  for(const [key, value] of Object.entries(a)) {
    audiences.push({ id: key, name: value ? value.toString() : '' });
  }
  return audiences;
}

/**
 * Gets stores structure.
 * @param filter Options to narrow down the result .
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param apiKey Studio apiKey.
 * @returns Stores with installations, campaigns and categories.
 * ``` typescript
 * // example call
 * getCollapsed({}, 'broox-studio-development', clientId, apiKey).then(...
 * ```
 */
export const getCollapsed = async (filter: Filter, project: string, clientId: string, apiKey: string) => {
  const parsedFilter = parseFilter(filter);
  return await get('collapsed', parsedFilter, project, clientId, apiKey);
}

const parseFilter = (filter: Filter) => {
  const f: any = {};
  filter.campaignId && (f.campaign_id = filter.campaignId);
  filter.locationId && (f.store_id = filter.locationId);
  filter.installationId && (f.installation_id = filter.installationId);
  filter.from && (f.bt = moment(filter.from).startOf('day').format('YYYY-MM-DDTHH:mm:ss'));
  filter.to && (f.et = moment(filter.to).endOf('day').format('YYYY-MM-DDTHH:mm:ss'));
  return f;
}

const by = async (split: (filter: any, project: string, clientId: string, apiKey: string) => Promise<any>, filter: any, project: string, clientId: string, apiKey: string): Promise<By> => {
  // traffic
  let f = { ... filter, ev_action: 'in', ev_category: Category.Profile };
  const traffic = await split(f, project, clientId, apiKey);
  // views
  f = { ... filter, is_view: true, ev_category: Category.Profile };
  const views = await split(f, project, clientId, apiKey);
  // dwell
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_dwell', ev_category: Category.Profile };
  const dwell = await split(f, project, clientId, apiKey);
  // attention
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_category: Category.Profile };
  const attention = await split(f, project, clientId, apiKey);
  // lift interactions
  f = { ... filter, ev_action: 'in', ev_category: Category.Sensor };
  const liftInteractions = await split(f, project, clientId, apiKey);
  // lift time
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'out', ev_category: Category.Sensor };
  const liftTime = await split(f, project, clientId, apiKey);
  // place interactions
  f = { ... filter, ev_action: 'in', ev_category: Category.Marker };
  const placeInteractions = await split(f, project, clientId, apiKey);
  // place time
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'out', ev_category: Category.Marker };
  const placeTime = await split(f, project, clientId, apiKey);
  return { traffic, views, dwell, attention, liftInteractions, liftTime, placeInteractions, placeTime };
}

const getUrl = (project: string) => {
  if(project.indexOf('.') !== -1) {
    return 'https://' + project;
  }
  else {
    return 'https://' + project + '.web.app';
  }
}

const getOptions = (apiKey: string) => {
  return {
    headers: {
      Authorization: 'Bearer ' + apiKey
    }
  }
}

const get = async (report: string, filter: any, project: string, clientId: string, apiKey: string) => {
  let params: any[] = [];
  for(const [key, value] of Object.entries(filter)) {
    params.push(key + '=' + encodeURI(`${value}`));
  }
  // fetch report
  const url = getUrl(project);
  const result = await fetch(url + '/analytics/' + clientId + '/' + report + '?' + params.join('&'), getOptions(apiKey));
  return await result.json();
}

const splitByYear = async (filter: any, project: string, clientId: string, apiKey: string): Promise<SingleValue[]> => {
  const result = await get('split', { ...filter, _split: 'year' }, project, clientId, apiKey);
  const sorted = result.split.sort((a: any, b: any) => (parseInt(a.key) > parseInt(b.key)) ? 1 : ((parseInt(b.key) > parseInt(a.key)) ? -1 : 0));
  const split: SingleValue[] = [];
  for(let i = 0; i < sorted.length; i++) {
    split.push({
      label: sorted[i].key,
      value: sorted[i].doc_count
    });
  }
  return split;
}

const splitByMonth = async (filter: any, project: string, clientId: string, apiKey: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  let i = 1;
  Object.values(Month).filter(m => typeof m === 'string').forEach(m => {
    values.set((i++).toString(), { name: m.toString(), value: 0 });
  });
  return splitBy('month', values, filter, project, clientId, apiKey);
}

const splitByWeekday = async (filter: any, project: string, clientId: string, apiKey: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  let i = 1;
  Object.values(Day).filter(m => typeof m === 'string').forEach(m => {
    values.set((i++).toString(), { name: m.toString(), value: 0 });
  });
  return await splitBy('weekday', values, filter, project, clientId, apiKey);
}

const splitByHour = async (filter: any, project: string, clientId: string, apiKey: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  for(let i = 0; i < 24; i++) {
    const n = i.toString().padStart(2, '0');
    values.set(n, { name: n, value: 0 });
  }
  return await splitBy('hour', values, filter, project, clientId, apiKey);
}

const splitBy = async (name: string, values: Map<any, any>, filter: any, project: string, clientId: string, apiKey: string): Promise<SingleValue[]> => {
  const result = await get('split', { ...filter, _split: name }, project, clientId, apiKey);
  for(let i = 0; i < result.split.length; i++) {
    const v = values.get(result.split[i].key);
    v.value = filter._aggregate === 'avg' ? result.split[i].average.value : result.split[i].doc_count;
  }
  const split: SingleValue[] = [];
  for(const [key, value] of values) {
    split.push({ label: key, value: value });
  }
  return split;
}

const multisplitBy = async (firstSplit: string, secondSplit: string, values: Map<any, any>, filter: any, project: string, clientId: string, apiKey: string): Promise<GroupValue[]> => {
  const result = await get('multisplit', { ...filter, _split0: firstSplit, _split1: secondSplit }, project, clientId, apiKey);
  for(let i = 0; i < result.split.length; i++) {
    const first = values.get(result.split[i].key[0]);
    const second = result.split[i].key[1];
    first[second] = filter._aggregate === 'avg' ? result.split[i].avg.value : result.split[i].doc_count;
  }
  const multisplit: GroupValue[] = [];
  for(const [key, value] of values) {
    const groupValue: GroupValue = {
      label: key.toString(),
      values: []
    };
    for(let [k, v] of value) {
      groupValue.values.push({
        label: k.toString(),
        value: v
      })
    }
    multisplit.push(groupValue);
  }
  return multisplit;
}

const ageBy = async (name: string, values: Map<any, any>, filter: any, project: string, clientId: string, apiKey: string): Promise<GroupValue[]> => {
  const f = { ...filter, _field_term: name, _field_ranges: 'target_age', _range1: '0-20',_range1_key: 'r1', _range2: '21-40', _range2_key: 'r2', _range3: '41-60', _range3_key: 'r3', _range4: '61-99', _range4_key: 'r4' };
  const result = await get('multisplit_range', f, project, clientId, apiKey);
  for(let i = 0; i < result.split.length; i++) {
    const value = values.get(result.split[i].key);
    value.r1 = result.split[i].split.buckets['r1'].doc_count;
    value.r2 = result.split[i].split.buckets['r2'].doc_count;
    value.r3 = result.split[i].split.buckets['r3'].doc_count;
    value.r4 = result.split[i].split.buckets['r4'].doc_count;
  }
  const age: GroupValue[] = [];
  for(const [key, value] of values) {
    age.push({
      label: key,
      values: [{ label: f._range1_key, value: value.r1 }, { label: f._range2_key, value: value.r2 }, { label: f._range3_key, value: value.r3 }, { label: f._range4_key, value: value.r4 }]
    });
  }
  return age;
}