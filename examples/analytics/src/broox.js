let $a04fb544e3c19b84$export$3a8840c5b2ecf003;
(function($a04fb544e3c19b84$export$3a8840c5b2ecf003) {
    $a04fb544e3c19b84$export$3a8840c5b2ecf003["Sensor"] = 'sensor';
    $a04fb544e3c19b84$export$3a8840c5b2ecf003["Profile"] = 'profile';
    $a04fb544e3c19b84$export$3a8840c5b2ecf003["Marker"] = 'onevent';
})($a04fb544e3c19b84$export$3a8840c5b2ecf003 || ($a04fb544e3c19b84$export$3a8840c5b2ecf003 = {
}));


let $1c64e0bb926b3d27$export$7a9a31a911eb9a20;
(function($1c64e0bb926b3d27$export$7a9a31a911eb9a20) {
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Monday"] = 0] = "Monday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Tuesday"] = 1] = "Tuesday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Wednesday"] = 2] = "Wednesday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Thursday"] = 3] = "Thursday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Friday"] = 4] = "Friday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Saturday"] = 5] = "Saturday";
    $1c64e0bb926b3d27$export$7a9a31a911eb9a20[$1c64e0bb926b3d27$export$7a9a31a911eb9a20["Sunday"] = 6] = "Sunday";
})($1c64e0bb926b3d27$export$7a9a31a911eb9a20 || ($1c64e0bb926b3d27$export$7a9a31a911eb9a20 = {
}));


let $2f729d994273c84f$export$951c8378cdfec6e6;
(function($2f729d994273c84f$export$951c8378cdfec6e6) {
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["January"] = 0] = "January";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["February"] = 1] = "February";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["March"] = 2] = "March";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["April"] = 3] = "April";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["May"] = 4] = "May";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["June"] = 5] = "June";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["July"] = 6] = "July";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["August"] = 7] = "August";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["September"] = 8] = "September";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["October"] = 9] = "October";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["November"] = 10] = "November";
    $2f729d994273c84f$export$951c8378cdfec6e6[$2f729d994273c84f$export$951c8378cdfec6e6["December"] = 11] = "December";
})($2f729d994273c84f$export$951c8378cdfec6e6 || ($2f729d994273c84f$export$951c8378cdfec6e6 = {
}));


const $23e8683264e90450$export$85d699ca8330b9a9 = async (filter, project, clientId, token)=>{
    // TODO: check value format
    // traffic
    const traffic = await $23e8683264e90450$var$get('eventcount', {
        ...filter,
        ev_action: 'in',
        ev_category: 'profile'
    }, project, clientId, token);
    // views
    const views = await $23e8683264e90450$var$get('eventcount', {
        ...filter,
        is_view: true,
        ev_action: 'out',
        ev_category: 'profile'
    }, project, clientId, token);
    // genders
    let result = await $23e8683264e90450$var$get('split', {
        ...filter,
        _split: 'target_gender'
    }, project, clientId, token);
    const labelsMap = new Map([
        [
            'M',
            'Male'
        ],
        [
            'F',
            'Female'
        ]
    ]);
    const genders = {
        data: [],
        labels: []
    };
    for(let i = 0; i < result.split.length; i++){
        genders.labels.push(labelsMap.get(result.split[i].key));
        genders.data.push(result.split[i].doc_count);
    }
    // ages
    const ageRanges = {
        _range1: '0-20',
        _range1_key: 'Children (0-20)',
        _range2: '21-40',
        _range2_key: 'Young (21-40)',
        _range3: '41-60',
        _range3_key: 'Middle Age (41-60)',
        _range4: '61-99',
        _range4_key: 'Elder (61-99)'
    };
    result = await $23e8683264e90450$var$get('ranges', {
        ...filter,
        ...ageRanges,
        _split: 'target_age'
    }, project, clientId, token);
    const ages = {
        labels: [
            '<20',
            '21-40',
            '41-60',
            '>60'
        ],
        data: [
            result.split[ageRanges._range1_key].doc_count,
            result.split[ageRanges._range2_key].doc_count,
            result.split[ageRanges._range3_key].doc_count,
            result.split[ageRanges._range4_key].doc_count
        ]
    };
    // dwell
    const dwell = await $23e8683264e90450$var$get('average', {
        ...filter,
        _avgfield: 'target_dwell',
        ev_action: 'out',
        ev_category: 'profile'
    }, project, clientId, token);
    // attention
    const attention = await $23e8683264e90450$var$get('average', {
        ...filter,
        _avgfield: 'target_attention',
        ev_action: 'out',
        ev_category: 'profile'
    }, project, clientId, token);
    // emotion
    result = await $23e8683264e90450$var$get('split', {
        ...filter,
        _split: 'target_dominant_emotion'
    }, project, clientId, token);
    const emotions = {
        data: [],
        labels: []
    };
    for(let i1 = 0; i1 < result.split.length; i1++){
        emotions.labels.push(result.split[i1].key);
        emotions.data.push(result.split[i1].doc_count);
    }
    return {
        traffic: traffic,
        views: views,
        genders: genders,
        ages: ages,
        dwell: dwell,
        attention: attention,
        emotions: emotions
    };
};
const $23e8683264e90450$export$e2005c9600188ac7 = async (filter, categories, audiences, project, clientId, token)=>{
    // TODO: check value format
    // interactions
    const c1 = categories.filter((c)=>c === $a04fb544e3c19b84$export$3a8840c5b2ecf003.Sensor || c === $a04fb544e3c19b84$export$3a8840c5b2ecf003.Marker
    );
    const category = c1.join('|');
    const interactions = await $23e8683264e90450$var$get('eventcount', {
        ...filter,
        ev_category: category,
        ev_action: 'in'
    }, project, clientId, token);
    // interaction time
    const interactionTime = await $23e8683264e90450$var$get('average', {
        ...filter,
        ev_category: category,
        _avgfield: 'target_attention_time',
        ev_action: 'out'
    }, project, clientId, token);
    // most interacted
    const mostInteracted = await $23e8683264e90450$var$get('topcount', {
        ...filter,
        ev_category: category,
        ev_action: 'in'
    }, project, clientId, token);
    // product distribution
    let result = await $23e8683264e90450$var$get('split', {
        ...filter,
        ev_category: category,
        _split: 'audience_id',
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time',
        ev_action: 'in'
    }, project, clientId, token);
    const productDistribution = [];
    const labelsMap = new Map();
    for (let audience of audiences)labelsMap.set(audience.id, audience.name);
    for(let i = 0; i < result.split.length; i++)productDistribution.push({
        name: labelsMap.get(result.split[i].key),
        value: result.split[i].doc_count
    });
    return {
        interactions: interactions,
        interactionTime: interactionTime,
        mostInteracted: mostInteracted,
        productDistribution: productDistribution
    };
};
const $23e8683264e90450$export$818372094d141ed4 = async (filter, project, clientId, token)=>{
    // gender
    let f = {
        ...filter,
        _split0: 'year',
        _split1: 'target_gender'
    };
    let result = await $23e8683264e90450$var$get('multisplit', f, project, clientId, token);
    const genderMap = new Map();
    for(let i = 0; i < result.split.length; i++){
        const value = genderMap.get(result.split[i].key[0]) || {
            M: 0,
            F: 0
        };
        value[result.split[i].key[1]] = filter._aggregate === 'avg' ? result.split[i].avg.value : result.split[i].doc_count;
        genderMap.set(result.split[i].key[0], value);
    }
    const genderData = [
        [],
        []
    ];
    for (const v of genderMap.values()){
        genderData[0].push(v.M);
        genderData[1].push(v.f);
    }
    const gender = {
        data: genderData,
        labels: Array.from(genderMap.keys())
    };
    // age
    f = {
        ...filter,
        _field_term: 'year',
        _field_ranges: 'target_age',
        _range1: '0-20',
        _range1_key: 'r1',
        _range2: '21-40',
        _range2_key: 'r2',
        _range3: '41-60',
        _range3_key: 'r3',
        _range4: '61-99',
        _range4_key: 'r4'
    };
    result = await $23e8683264e90450$var$get('multisplit_range', f, project, clientId, token);
    const ageMap = new Map();
    for(let i2 = 0; i2 < result.split.length; i2++){
        const year = ageMap.get(result.split[i2].key) || {
            name: result.split[i2].key,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        };
        year.r1 = result.split[i2].split.buckets['r1'].doc_count;
        year.r2 = result.split[i2].split.buckets['r2'].doc_count;
        year.r3 = result.split[i2].split.buckets['r3'].doc_count;
        year.r4 = result.split[i2].split.buckets['r4'].doc_count;
        ageMap.set(result.split[i2].key, year);
    }
    const age = {
        data: [
            [],
            [],
            [],
            []
        ],
        labels: []
    };
    for (const v1 of ageMap.values()){
        age.data[0].push(v1.r1);
        age.data[1].push(v1.r2);
        age.data[2].push(v1.r3);
        age.data[3].push(v1.r4);
        age.labels.push(v1.name);
    }
    // product distribution
    f = {
        ...filter,
        _split0: 'year',
        _split1: 'audience_id',
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time'
    };
    result = await $23e8683264e90450$var$get('multisplit', f, project, clientId, token);
    const productDistributionMap = new Map();
    for(let i3 = 0; i3 < result.split.length; i3++){
        const value = productDistributionMap.get(result.split[i3].key[0]) || {
            name: result.split[i3].key[0]
        };
        value[result.split[i3].key[1]] = f._aggregate === 'avg' ? result.split[i3].avg.value : result.split[i3].doc_count;
        productDistributionMap.set(result.split[i3].key[0], value);
    }
    const productDistribution = {
        data: {
        },
        labels: []
    };
    for (const v2 of productDistributionMap.values()){
        for(const prop in v2)if (prop === 'name') productDistribution.labels.push(v2.name);
        else {
            !productDistribution.data[prop] && (productDistribution.data[prop] = []);
            productDistribution.data[prop].push(v2[prop]);
        }
    }
    const main = await $23e8683264e90450$var$by($23e8683264e90450$var$splitByYear, filter, project, clientId, token);
    return {
        ...main,
        gender: gender,
        age: age,
        productDistribution: productDistribution
    };
};
const $23e8683264e90450$export$bf14ac87319daca4 = async (filter, project, clientId, token)=>{
    // gender
    const genderValues = new Map();
    const ageValues = new Map();
    const productDistributionValues = new Map();
    let i = 1;
    Object.values($2f729d994273c84f$export$951c8378cdfec6e6).filter((m)=>typeof m === 'string'
    ).forEach((m)=>{
        genderValues.set(i.toString(), {
            name: m.toString(),
            M: 0,
            F: 0
        });
        ageValues.set(i.toString(), {
            name: m.toString(),
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        });
        productDistributionValues.set((i++).toString(), {
            name: m.toString()
        });
    });
    const gender = await $23e8683264e90450$var$multisplitBy('month', 'target_gender', genderValues, filter, project, clientId, token);
    const age = await $23e8683264e90450$var$ageBy('month', ageValues, filter, project, clientId, token);
    const f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time'
    };
    const productDistribution = await $23e8683264e90450$var$multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, token);
    const main = await $23e8683264e90450$var$by($23e8683264e90450$var$splitByMonth, filter, project, clientId, token);
    return {
        ...main,
        gender: gender,
        age: age,
        productDistribution: productDistribution
    };
};
const $23e8683264e90450$export$e24d69d4baf99038 = async (filter, project, clientId, token)=>{
    // gender
    const genderValues = new Map();
    const ageValues = new Map();
    const productDistributionValues = new Map();
    let i = 1;
    Object.values($1c64e0bb926b3d27$export$7a9a31a911eb9a20).filter((m)=>typeof m === 'string'
    ).forEach((m)=>{
        genderValues.set(i.toString(), {
            name: m.toString(),
            M: 0,
            F: 0
        });
        ageValues.set(i.toString(), {
            name: m.toString(),
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        });
        productDistributionValues.set((i++).toString(), {
            name: m.toString()
        });
    });
    const gender = await $23e8683264e90450$var$multisplitBy('weekday', 'target_gender', genderValues, filter, project, clientId, token);
    const age = await $23e8683264e90450$var$ageBy('weekday', ageValues, filter, project, clientId, token);
    const f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time'
    };
    const productDistribution = await $23e8683264e90450$var$multisplitBy('month', 'audience_id', productDistributionValues, f, project, clientId, token);
    const main = await $23e8683264e90450$var$by($23e8683264e90450$var$splitByWeekday, filter, project, clientId, token);
    return {
        ...main,
        gender: gender,
        age: age,
        productDistribution: productDistribution
    };
};
const $23e8683264e90450$export$d408fc5b361d3a42 = async (filter, project, clientId, token)=>{
    // gender
    const genderValues = new Map();
    const ageValues = new Map();
    const productDistributionValues = new Map();
    let i = 1;
    for(let i4 = 0; i4 < 24; i4++){
        const n = i4.toString().padStart(2, '0');
        genderValues.set(n.toString(), {
            name: n.toString(),
            M: 0,
            F: 0
        });
        ageValues.set(n.toString(), {
            name: n.toString(),
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        });
        productDistributionValues.set(n.toString(), {
            name: n.toString()
        });
    }
    const gender = await $23e8683264e90450$var$multisplitBy('hour', 'target_gender', genderValues, filter, project, clientId, token);
    const age = await $23e8683264e90450$var$ageBy('hour', ageValues, filter, project, clientId, token);
    const f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time'
    };
    const productDistribution = await $23e8683264e90450$var$multisplitBy('hour', 'audience_id', productDistributionValues, f, project, clientId, token);
    const main = await $23e8683264e90450$var$by($23e8683264e90450$var$splitByHour, filter, project, clientId, token);
    return {
        ...main,
        gender: gender,
        age: age,
        productDistribution: productDistribution
    };
};
const $23e8683264e90450$export$6bb76d6eba7e258c = async (project, clientId, token)=>{
    const result = await fetch($23e8683264e90450$var$getUrl(project) + '/clientmeta/' + clientId, $23e8683264e90450$var$getOptions(token));
    return result.json();
};
const $23e8683264e90450$export$1031afc5ff1bd37d = async (filter, project, clientId, token)=>{
    return $23e8683264e90450$var$get('audiences', filter, project, clientId, token);
};
const $23e8683264e90450$export$c5fc83b78e20e5d7 = async (filter, project, clientId, token)=>{
    return $23e8683264e90450$var$get('collapsed', filter, project, clientId, token);
};
const $23e8683264e90450$var$by = async (split, filter, project, clientId, token)=>{
    // traffic
    let f = {
        ...filter,
        ev_action: 'in',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Profile
    };
    const traffic = await split(f, project, clientId, token);
    // views
    f = {
        ...filter,
        is_view: true,
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Profile
    };
    const views = await split(f, project, clientId, token);
    // dwell
    f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_dwell',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Profile
    };
    const dwell = await split(f, project, clientId, token);
    // attention
    f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Profile
    };
    const attention = await split(f, project, clientId, token);
    // lift interactions
    f = {
        ...filter,
        ev_action: 'in',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Sensor
    };
    const liftInteractions = await split(f, project, clientId, token);
    // lift time
    f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time',
        ev_action: 'out',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Sensor
    };
    const liftTime = await split(f, project, clientId, token);
    // place interactions
    f = {
        ...filter,
        ev_action: 'in',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Marker
    };
    const placeInteractions = await split(f, project, clientId, token);
    // place time
    f = {
        ...filter,
        _aggregate: 'avg',
        _aggregate_field: 'target_attention_time',
        ev_action: 'out',
        ev_category: $a04fb544e3c19b84$export$3a8840c5b2ecf003.Marker
    };
    const placeTime = await split(f, project, clientId, token);
    return {
        traffic: traffic,
        views: views,
        dwell: dwell,
        attention: attention,
        liftInteractions: liftInteractions,
        liftTime: liftTime,
        placeInteractions: placeInteractions,
        placeTime: placeTime
    };
};
const $23e8683264e90450$var$getUrl = (project)=>{
    if (project.indexOf('.') !== -1) return 'https://' + project;
    else return 'https://' + project + '.web.app';
};
const $23e8683264e90450$var$getOptions = (token)=>{
    return {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
};
const $23e8683264e90450$var$get = async (report, filter, project, clientId, token)=>{
    let params = [];
    for (const [key, value] of Object.entries(filter))params.push(key + '=' + encodeURI(`${value}`));
    // fetch report
    const url = $23e8683264e90450$var$getUrl(project);
    const result = await fetch(url + '/analytics/' + clientId + '/' + report + '?' + params.join('&'), $23e8683264e90450$var$getOptions(token));
    return await result.json();
};
const $23e8683264e90450$var$splitByYear = async (filter, project, clientId, token)=>{
    const result = await $23e8683264e90450$var$get('split', {
        ...filter,
        _split: 'year'
    }, project, clientId, token);
    const sorted = result.split.sort((a, b)=>parseInt(a.key) > parseInt(b.key) ? 1 : parseInt(b.key) > parseInt(a.key) ? -1 : 0
    );
    const data = [];
    const labels = [];
    for(let i = 0; i < sorted.length; i++){
        labels.push(sorted[i].key);
        data.push(filter._aggregate === 'avg' ? sorted[i].average.value : sorted[i].doc_count);
    }
    return {
        data: data,
        labels: labels
    };
};
const $23e8683264e90450$var$splitByMonth = async (filter, project, clientId, token)=>{
    const values = new Map();
    let i = 1;
    Object.values($2f729d994273c84f$export$951c8378cdfec6e6).filter((m)=>typeof m === 'string'
    ).forEach((m)=>{
        values.set((i++).toString(), {
            name: m.toString(),
            value: 0
        });
    });
    return $23e8683264e90450$var$splitBy('month', values, filter, project, clientId, token);
};
const $23e8683264e90450$var$splitByWeekday = async (filter, project, clientId, token)=>{
    const values = new Map();
    let i = 1;
    Object.values($1c64e0bb926b3d27$export$7a9a31a911eb9a20).filter((m)=>typeof m === 'string'
    ).forEach((m)=>{
        values.set((i++).toString(), {
            name: m.toString(),
            value: 0
        });
    });
    return await $23e8683264e90450$var$splitBy('weekday', values, filter, project, clientId, token);
};
const $23e8683264e90450$var$splitByHour = async (filter, project, clientId, token)=>{
    const values = new Map();
    for(let i = 0; i < 24; i++){
        const n = i.toString().padStart(2, '0');
        values.set(n, {
            name: n,
            value: 0
        });
    }
    return await $23e8683264e90450$var$splitBy('hour', values, filter, project, clientId, token);
};
const $23e8683264e90450$var$splitBy = async (name, values, filter, project, clientId, token)=>{
    const result = await $23e8683264e90450$var$get('split', {
        ...filter,
        _split: name
    }, project, clientId, token);
    for(let i = 0; i < result.split.length; i++){
        const v = values.get(result.split[i].key);
        v.value = filter._aggregate === 'avg' ? result.split[i].average.value : result.split[i].doc_count;
    }
    const data = [];
    const labels = [];
    for (const v of values.values()){
        data.push(v.value);
        labels.push(v.name);
    }
    return {
        data: data,
        labels: labels
    };
};
const $23e8683264e90450$var$multisplitBy = async (firstSplit, secondSplit, values, filter, project, clientId, token)=>{
    const result = await $23e8683264e90450$var$get('multisplit', {
        ...filter,
        _split0: firstSplit,
        _split1: secondSplit
    }, project, clientId, token);
    for(let i = 0; i < result.split.length; i++){
        const first = values.get(result.split[i].key[0]);
        const second = result.split[i].key[1];
        first[second] = filter._aggregate === 'avg' ? result.split[i].avg.value : result.split[i].doc_count;
    }
    const data = {
    };
    const labels = [];
    for (const v of values.values()){
        for(const prop in v)if (prop === 'name') labels.push(v.name);
        else {
            !data[prop] && (data[prop] = []);
            data[prop].push(v[prop]);
        }
    }
    return {
        data: data,
        labels: labels
    };
};
const $23e8683264e90450$var$ageBy = async (name, values, filter, project, clientId, token)=>{
    const f = {
        ...filter,
        _field_term: name,
        _field_ranges: 'target_age',
        _range1: '0-20',
        _range1_key: 'r1',
        _range2: '21-40',
        _range2_key: 'r2',
        _range3: '41-60',
        _range3_key: 'r3',
        _range4: '61-99',
        _range4_key: 'r4'
    };
    const result = await $23e8683264e90450$var$get('multisplit_range', f, project, clientId, token);
    for(let i = 0; i < result.split.length; i++){
        const value = values.get(result.split[i].key);
        value.r1 = result.split[i].split.buckets['r1'].doc_count;
        value.r2 = result.split[i].split.buckets['r2'].doc_count;
        value.r3 = result.split[i].split.buckets['r3'].doc_count;
        value.r4 = result.split[i].split.buckets['r4'].doc_count;
    }
    const data = [
        [],
        [],
        [],
        []
    ];
    const labels = [];
    for (const v of values.values()){
        data[0].push(v.r1);
        data[1].push(v.r2);
        data[2].push(v.r3);
        data[3].push(v.r4);
        labels.push(v.name);
    }
    return {
        data: data,
        labels: labels
    };
};




export {$23e8683264e90450$export$85d699ca8330b9a9 as getProfile, $23e8683264e90450$export$e2005c9600188ac7 as getProduct, $23e8683264e90450$export$1031afc5ff1bd37d as getAudiences, $23e8683264e90450$export$6bb76d6eba7e258c as getClient, $23e8683264e90450$export$c5fc83b78e20e5d7 as getCollapsed, $23e8683264e90450$export$818372094d141ed4 as getByYear, $23e8683264e90450$export$bf14ac87319daca4 as getByMonth, $23e8683264e90450$export$e24d69d4baf99038 as getByWeekday, $23e8683264e90450$export$d408fc5b361d3a42 as getByHour};
//# sourceMappingURL=broox.js.map
