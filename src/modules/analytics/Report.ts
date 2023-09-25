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
 * @param token Studio token.
 * @returns Profile information
 * ``` typescript
 * // example
 * getProfile({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('views', result.views);
 * }
 * ```
 */
export const getProfile = async (filter: Filter, project: string, clientId: string, token: string): Promise<Profile> => {
  const parsedFilter = parseFilter(filter);
  // TODO: check value format
  // traffic
  const traffic = await get('eventcount', { ...parsedFilter, ev_action: 'in', ev_category: 'profile' }, project, clientId, token);
  // views
  const views = await get('eventcount', { ...parsedFilter, is_view: true, ev_action: 'out', ev_category: 'profile' }, project, clientId, token);
  // genders
  let result = await get('split', { ...parsedFilter, _split: 'target_gender' }, project, clientId, token);
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
  result = await get('ranges', { ...parsedFilter, ...ageRanges, _split: 'target_age' }, project, clientId, token);
  const age: SingleValue[] = [
    { label: ageRanges._range1_key, value: result.split[ageRanges._range1_key].doc_count },
    { label: ageRanges._range2_key, value: result.split[ageRanges._range2_key].doc_count },
    { label: ageRanges._range3_key, value: result.split[ageRanges._range3_key].doc_count },
    { label: ageRanges._range4_key, value: result.split[ageRanges._range4_key].doc_count }
  ]
  // dwell
  const dwell = await get('average', { ...parsedFilter, _avgfield: 'target_dwell', ev_action: 'out', ev_category: 'profile' }, project, clientId, token);
  // attention
  const attention = await get('average', { ...parsedFilter, _avgfield: 'target_attention', ev_action: 'out', ev_category: 'profile' }, project, clientId, token);
  // emotion
  result = await get('split', { ...parsedFilter, _split: 'target_dominant_emotion' }, project, clientId, token);
  const emotion: SingleValue[] = [];
  for(let i = 0; i < result.split.length; i++) {
    emotion.push({ label: result.split[i].key, value: result.split[i].doc_count });
  }
  return { traffic, views, gender, age, dwell, attention, emotion };
}

/**
 * Gets product information
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Product information (interactions, interaction time, most interacted and product distribution).
 * ``` typescript
 * // example
 * getProduct({}, ['marker'], audiences, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('product distribution', result.productDistribution);
 * }
 * ```
 */
export const getProduct = async (filter: Filter, categories: string[], audiences: Audience[], project: string, clientId: string, token: string): Promise<Product> => {
  const parsedFilter = parseFilter(filter);
  // TODO: check value format
  // interactions
  const c = categories.filter(c => c === Category.Sensor || c === Category.Marker);
  const category = c.join('|');
  const interactions = await get('eventcount', { ...parsedFilter, ev_category: category, ev_action: 'in' }, project, clientId, token);
  // interaction time
  const interactionTime = await get('average', { ...parsedFilter, ev_category: category, _avgfield: 'target_attention_time', ev_action: 'out' }, project, clientId, token);
  // most interacted
  const mostInteracted = await get('topcount', { ...parsedFilter, ev_category: category, ev_action: 'in' }, project, clientId, token);
  // product distribution
  let result = await get('split', { ...parsedFilter, ev_category: category, _split: 'audience_id', _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'in' }, project, clientId, token);
  const labelsMap = new Map();
  for(let audience of audiences) {
    labelsMap.set(audience.id, audience.name);
  }
  const productDistribution: SingleValue[] = [];
  for(let i = 0; i < result.split.length; i++) {
    productDistribution.push({ label: labelsMap.get(result.split[i].key), value: result.split[i].doc_count });
  }
  return { interactions, interactionTime, mostInteracted, productDistribution };
}

/**
 * Gets information grouped by year.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Information grouped by year (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example
 * getByYear({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('views by year', result.views);
 * }
 * ```
 */
export const getByYear = async (filter: Filter, project: string, clientId: string, token: string): Promise<By> => {
  const parsedFilter = parseFilter(filter);
  // gender
  let f = { ...parsedFilter, _split0: 'year', _split1: 'target_gender' };
  let result = await get('multisplit', f, project, clientId, token);
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
  result = await get('multisplit_range', f, project, clientId, token);
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
  result = await get('multisplit', f, project, clientId, token);
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
  const main = await by(splitByYear, filter, project, clientId, token);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by month.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Information grouped by month (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example
 * getByMonth({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('traffic by month', result.traffic);
 * }
 * ```
 */
export const getByMonth = async (filter: Filter, project: string, clientId: string, token: string): Promise<By> => {
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
  const gender = await multisplitBy('month', 'target_gender', genderValues, parsedFilter, project, clientId, token);
  const age = await ageBy('month', ageValues, parsedFilter, project, clientId, token);
  const f = { ...parsedFilter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, token);
  const main = await by(splitByMonth, parsedFilter, project, clientId, token);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by week day.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Information grouped by week day (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example
 * getByWeekday({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('attention by weekday', result.attention);
 * }
 * ```
 */
export const getByWeekday = async (filter: any, project: string, clientId: string, token: string): Promise<By> => {
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
  const gender = await multisplitBy('weekday', 'target_gender', genderValues, parsedFilter, project, clientId, token);
  const age = await ageBy('weekday', ageValues, parsedFilter, project, clientId, token);
  const f = { ...filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, token);
  const main = await by(splitByWeekday, parsedFilter, project, clientId, token);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets information grouped by hour.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Information grouped by hour (age, attention, dwell, gender, lift interactions, lift time, place interaction, place time, product distribution, traffic and views).
 * ``` typescript
 * // example
 * getByHour({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('dwell by hour', result.dwell);
 * }
 * ```
 */
export const getByHour = async (filter: any, project: string, clientId: string, token: string): Promise<By> => {
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
  const gender = await multisplitBy('hour', 'target_gender', genderValues, parsedFilter, project, clientId, token);
  const age = await ageBy('hour', ageValues, parsedFilter, project, clientId, token);
  const f = { ...filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time' };
  const productDistribution = await multisplitBy('hour', 'audience_id', productDistributionValues, f, project, clientId, token);
  const main = await by(splitByHour, parsedFilter, project, clientId, token);
  return { ...main, gender, age, productDistribution };
}

/**
 * Gets client information.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Client information.
 * ``` typescript
 * // example
 * getClient({}, 'broox-studio-development', clientId, token).then(result => {
 *   console.log('client', result);
 * }
 * ```
 */
export const getClient = async (project: string, clientId: string, token: string) => {
  const result = await fetch(getUrl(project) + '/clientmeta/' + clientId, getOptions(token));
  return result.json();
}

/**
 * Gets audiences.
 * @param filter Options to narrow down the result.
 * @param project Studio project.
 * @param clientId Studio client id.
 * @param token Studio token.
 * @returns Audiences.
 * ``` typescript
 * // example
 * getAudiences({}, 'broox-studio-development', clientId, token).then(result => {
 *   const audiences = [];
 *   for(const [key, value] of Object.entries(result)) {
 *     audiences.push({ id: key, name: value });
 *   }
 * }
 * ```
 */
export const getAudiences = async (filter: Filter, project: string, clientId: string, token: string): Promise<Audience[]> => {
  const parsedFilter = parseFilter(filter);
  const audiences: Audience[] = [];
  const a = await get('audiences', parsedFilter, project, clientId, token);
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
 * @param token Studio token.
 * @returns Stores with installations, campaigns and categories.
 * ``` typescript
 * // example
 * getAudiences({}, 'broox-studio-development', clientId, token).then(audiences => {
 *   console.log(audiences);
 * }
 * ```
 */
export const getCollapsed = async (filter: Filter, project: string, clientId: string, token: string) => {
  const parsedFilter = parseFilter(filter);
  return await get('collapsed', parsedFilter, project, clientId, token);
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

const by = async (split: (filter: any, project: string, clientId: string, token: string) => Promise<any>, filter: any, project: string, clientId: string, token: string): Promise<By> => {
  // traffic
  let f = { ... filter, ev_action: 'in', ev_category: Category.Profile };
  const traffic = await split(f, project, clientId, token);
  // views
  f = { ... filter, is_view: true, ev_category: Category.Profile };
  const views = await split(f, project, clientId, token);
  // dwell
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_dwell', ev_category: Category.Profile };
  const dwell = await split(f, project, clientId, token);
  // attention
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_category: Category.Profile };
  const attention = await split(f, project, clientId, token);
  // lift interactions
  f = { ... filter, ev_action: 'in', ev_category: Category.Sensor };
  const liftInteractions = await split(f, project, clientId, token);
  // lift time
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'out', ev_category: Category.Sensor };
  const liftTime = await split(f, project, clientId, token);
  // place interactions
  f = { ... filter, ev_action: 'in', ev_category: Category.Marker };
  const placeInteractions = await split(f, project, clientId, token);
  // place time
  f = { ... filter, _aggregate: 'avg', _aggregate_field: 'target_attention_time', ev_action: 'out', ev_category: Category.Marker };
  const placeTime = await split(f, project, clientId, token);
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

const getOptions = (token: string) => {
  return {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
}

const get = async (report: string, filter: any, project: string, clientId: string, token: string) => {
  let params: any[] = [];
  for(const [key, value] of Object.entries(filter)) {
    params.push(key + '=' + encodeURI(`${value}`));
  }
  // fetch report
  const url = getUrl(project);
  const result = await fetch(url + '/analytics/' + clientId + '/' + report + '?' + params.join('&'), getOptions(token));
  return await result.json();
}

const splitByYear = async (filter: any, project: string, clientId: string, token: string): Promise<SingleValue[]> => {
  const result = await get('split', { ...filter, _split: 'year' }, project, clientId, token);
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

const splitByMonth = async (filter: any, project: string, clientId: string, token: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  let i = 1;
  Object.values(Month).filter(m => typeof m === 'string').forEach(m => {
    values.set((i++).toString(), { name: m.toString(), value: 0 });
  });
  return splitBy('month', values, filter, project, clientId, token);
}

const splitByWeekday = async (filter: any, project: string, clientId: string, token: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  let i = 1;
  Object.values(Day).filter(m => typeof m === 'string').forEach(m => {
    values.set((i++).toString(), { name: m.toString(), value: 0 });
  });
  return await splitBy('weekday', values, filter, project, clientId, token);
}

const splitByHour = async (filter: any, project: string, clientId: string, token: string): Promise<SingleValue[]> => {
  const values = new Map<string, any>();
  for(let i = 0; i < 24; i++) {
    const n = i.toString().padStart(2, '0');
    values.set(n, { name: n, value: 0 });
  }
  return await splitBy('hour', values, filter, project, clientId, token);
}

const splitBy = async (name: string, values: Map<any, any>, filter: any, project: string, clientId: string, token: string): Promise<SingleValue[]> => {
  const result = await get('split', { ...filter, _split: name }, project, clientId, token);
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

const multisplitBy = async (firstSplit: string, secondSplit: string, values: Map<any, any>, filter: any, project: string, clientId: string, token: string): Promise<GroupValue[]> => {
  const result = await get('multisplit', { ...filter, _split0: firstSplit, _split1: secondSplit }, project, clientId, token);
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

const ageBy = async (name: string, values: Map<any, any>, filter: any, project: string, clientId: string, token: string): Promise<GroupValue[]> => {
  const f = { ...filter, _field_term: name, _field_ranges: 'target_age', _range1: '0-20',_range1_key: 'r1', _range2: '21-40', _range2_key: 'r2', _range3: '41-60', _range3_key: 'r3', _range4: '61-99', _range4_key: 'r4' };
  const result = await get('multisplit_range', f, project, clientId, token);
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