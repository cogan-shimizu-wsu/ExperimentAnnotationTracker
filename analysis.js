class SubjectGroup {
    constructor(subject_group) {
        this.subject_group = subject_group;
        this.basic_stats = computeBasicStats(subject_group);
        this.pma_stats = '';
    }
}

/************************************************************************ */
// Reference to the analysis button
const analyzeButton = document.getElementById('analyze-button');

function getAnalysisType() {
    // Get which analysis option is checked (there is probably a better way)
    let analysisOption;
    $.each($('input[name=analysis-type]:checked'), function () {
        analysisOption = this;
    });

    return analysisOption.id;
}

function checkPma() {
    let temp = false;
    $.each($('input[id=per-minute-analysis]:checked'), function () {
        temp = true;
    })
    return temp;
}

function oneWayAnalysisGrouping(subjects_data) {
    // Get the reference to the dropdown and extract the value
    const oneWayAnalysisDropdown = $('#1-way-analysis-dropdown');
    const parameter = oneWayAnalysisDropdown.dropdown('get value');

    if (parameter !== "") {
        // Group the subjects by the parameter
        return groupSubjects(subjects_data, parameter);
    }
    else {
        window.alert('Please choose a parameter.');
    }
}

function twoWayAnalysis(subjects_data) {
    const twoWayAnalysisFirstDropdown = $('#2-way-analysis-dropdown-1');
    const firstParameter = twoWayAnalysisFirstDropdown.dropdown('get value');
    const twoWayAnalysisSecondDropdown = $('#2-way-analysis-dropdown-2');
    const secondParameter = twoWayAnalysisSecondDropdown.dropdown('get value');

    if (firstParameter === secondParameter) {
        window.alert('Please choose two different parameters');
    }
    else if (firstParameter === "" || secondParameter === "") {
        window.alert('Please choose two parameters.');
    }
    else {
        let two_way_groups = [];

        // Get 
        let one_way_grouping = groupSubjects(subjects_data, firstParameter);

        for(let one_way_group of one_way_grouping) {
            const two_way_grouping = groupSubjects(one_way_group.subject_group, secondParameter);

            two_way_grouping.forEach(twg => two_way_groups.push(twg));
        }

        return two_way_groups;
    }
}

function perMinuteAnalysis(grouping) {
    // Get reference and extract interval value
    // const analysisIntervalField = document.getElementById('analysis-interval-field');
    // const interval = Number.parseInt(analysisIntervalField.value);
    const interval = 60;
    const num_intervals = current_experiment.scoring_session_length / interval;

    // For each subject group
    for (let group of Object.values(grouping)) {

        // For each subject in that group
        for (let subject of Object.values(group.subject_group)) {
            // Add the requisite pma stats to the subject
            pmaForSubject(num_intervals, interval, subject);
        }

        // Add the combined pma_stats to the group
        computePmaStats(group, num_intervals);
    }

    return grouping;
}

function pmaForSubject(num_intervals, interval, subject) {
    // construct the pma data structure
    let pmaStats = constructPmaStats(num_intervals);

    const timeline = subject.scoring_timeline.map(event => {
        // We want the time to ascend, so we flip the event times around the 
        // max score length
        // i.e. 300 - 298 = 2nd second
        const flipped_time = current_experiment.scoring_session_length - event.time;
        const new_event = {time: flipped_time, event: event.event};
        // The two above lines of code are for prevent a reference error
        // previously event.time was flipped, but this was propagated to the base instead
        // of only to the copy.
        return new_event;
    });

    let curr_interval = 0;
    let prev_event;
    for (let event of timeline) {
        // This means the behaviour has ended
        if (prev_event !== undefined) {
            // Check to see what interval the event is taking place in
            let event_interval = Math.floor(event.time / interval);
            if (curr_interval === event_interval) {
                // Update the frequency for scored behaviour with 
                // respect to the interval.
                pmaStats[curr_interval]['frequency-' + prev_event.event] += 1;
                pmaStats[curr_interval]['duration-' + prev_event.event] += event.time - prev_event.time;
            }
            else {
                // Finish current interval
                // Caclulates the end boundary of the current interval (in seconds)
                const end_interval = (curr_interval + 1) * interval;
                // What is the remaining time in the current interval
                const finish_interval_time = end_interval - prev_event.time;
                pmaStats[curr_interval]['frequency-' + prev_event.event] += 1;
                pmaStats[curr_interval]['duration-' + prev_event.event] += finish_interval_time;
                // Increase the curr_interval
                curr_interval += 1;

                // Catch up all full intervals
                for (; curr_interval < event_interval; curr_interval++) {
                    pmaStats[curr_interval]['frequency-' + prev_event.event] += 1;
                    pmaStats[curr_interval]['duration-' + prev_event.event] += interval;
                }

                // Finish remainder
                const rem_time = event.time - (curr_interval * interval)
                if (rem_time > 0) {
                    pmaStats[curr_interval]['frequency-' + prev_event.event] += 1;
                    pmaStats[curr_interval]['duration-' + prev_event.event] += rem_time;
                }
            }
        }
        // Update
        prev_event = event;
    }
    // Add the pmaStats to the subject
    subject['pma_stats'] = pmaStats;
}

/*
This creates a data struture of the form
the number is a 
pmaStats = {
    0: {
        f-bp1: 0,
        f-bp2: 0,
        .
        .
        .
        d-bp1: 0,
        d-bp2: 0,
        .
        .
        .
    },
    .
    .
    .
}
*/
function constructPmaStats(num_intervals) {
    let pmaStats = [];
    for (let i = 0; i < num_intervals; i++) {
        let minute = {};
        for (bp of current_experiment.behaviour_parameters) {
            let fbpString = 'frequency-' + bp.behaviour;
            const dbpString = 'duration-' + bp.behaviour;
            minute[fbpString] = 0;
            minute[dbpString] = 0;
        }
        // Add to pmaStats
        pmaStats.push(minute);
    }

    return pmaStats;
}

function collectSubjectsToAnalyze() {
    let subjects_data = [];

    $.each($('input[name=subject-checkbox]:checked'), function () {
        const subject_id = this.getAttribute('data-value');

        for (let subject of current_experiment.subjects_data) {
            if (subject.subject_id === subject_id) {
                subjects_data.push(subject);
                break;
            }
        }
    });

    return subjects_data;
}

/**
 * The program flow is as follows:
 * 
 * For pma:
 * First, we do one or two way grouping,
 * (technically, during this process the basic stats are also computed)
 * Then, we check if the per-minute-analysis checkbox is checked,
 * if it is, we pass the subject groups (grouping) to the perMinuteAnalysis
 * each subject in each group is newly equipped with pma stats
 * next, the subject_group is equipped with aggregate pma stats
 * these subject groups are then passed to the csv constructor in csv.js
 * 
 */
function analyzeExperiment() {
    const analysisType = getAnalysisType();
    const isPma = checkPma();

    const subjects_data = collectSubjectsToAnalyze();

    let csv_string;
    if (subjects_data.length === 0) {
        console.error('no subjects chosen');
    }
    else {
        if (analysisType === '1-way-analysis') {
            const grouping = oneWayAnalysisGrouping(subjects_data);

            if (isPma === true) {
                // Calcuate and add the PMA stats to the groups
                const pma_grouping = perMinuteAnalysis(grouping);

                csv_string = create_analysis_pma_csv(pma_grouping);
            }
            else {
                csv_string = create_analysis_csv(grouping);
            }
        }
        else if (analysisType === '2-way-analysis') {
            const grouping = twoWayAnalysis(subjects_data);

            if (isPma === true) {
                // Calcuate and add the PMA stats to the groups
                const pma_grouping = perMinuteAnalysis(grouping);

                csv_string = create_analysis_pma_csv(pma_grouping);
            }
            else {
                csv_string = create_analysis_csv(grouping);
            }
        }
        else {
            console.error('Something went wrong with analysis type.');
        }
    }

    if (csv_string !== undefined) {
        console.log('Experiment is Analyzed!');
        console.log(csv_string);
        packageDownload('analysis.csv', csv_string);
    }
}


// Register the event listener for the button click
analyzeButton.addEventListener(
    'click',
    analyzeExperiment
);

/****************************************************************************/
function groupSubjects(subjects_data, parameter) {
    // Get a reference to all the subjects in the current_experiment
    // const subjects_data = current_experiment.subjects_data;
    // This will hold all the distinct groups
    let grouped_subjects = {};

    for (let subject of subjects_data) {
        // What is the value of the parameter (e.g. Male, Female)
        let parameter_value = subject[parameter];

        // If there is a subject_group defined by that parameter value, just add this
        if (grouped_subjects.hasOwnProperty(parameter_value)) {
            grouped_subjects[parameter_value].push(subject);
        }
        else {
            let group = [];
            group.push(subject);

            grouped_subjects[parameter_value] = group;
        }
    }

    let subject_groups = [];
    for (subject_group of Object.values(grouped_subjects)) {
        subject_groups.push(new SubjectGroup(subject_group));
    }

    return subject_groups;
}

function computeBasicStats(subject_group) {
    // These lists will track the means, standard deviations, and standard errors of means.
    const avgs = [];
    const stds = [];
    const sems = [];

    for (let bp of current_experiment.behaviour_parameters) {
        let frequencies = [];
        let total_durations = [];
        let mean_durations = [];
        let sds = [];

        for (let subject of subject_group) {
            const individual_bp = subject.scoring_data[bp.key];


            frequencies.push(individual_bp.frequency);
            total_durations.push(individual_bp.total_duration);
            mean_durations.push(individual_bp.mean_duration);
            sds.push(individual_bp.sd);
        }

        const avg_frequency = arrAvg(frequencies);
        const avg_total_duration = arrAvg(total_durations);
        const avg_mean_duration = arrAvg(mean_durations);
        const avg_sd = arrAvg(sds);

        avgs.push(avg_frequency);
        avgs.push(avg_total_duration);
        avgs.push(avg_mean_duration);
        avgs.push(avg_sd);

        const std_frequency = arrSTD(frequencies);
        const std_total_duration = arrSTD(total_durations);
        const std_mean_duration = arrSTD(mean_durations);
        const std_sd = arrSTD(sds);

        stds.push(std_frequency);
        stds.push(std_total_duration);
        stds.push(std_mean_duration);
        stds.push(std_sd);

        const sem_frequency = std_frequency / Math.sqrt(frequencies.length);
        const sem_total_duration = std_total_duration / Math.sqrt(total_durations.length);
        const sem_mean_duration = std_mean_duration / Math.sqrt(mean_durations.length);
        const sem_sd = std_sd / Math.sqrt(sds.length);

        sems.push(sem_frequency);
        sems.push(sem_total_duration);
        sems.push(sem_mean_duration);
        sems.push(sem_sd);
    }

    const basic_stats = { avgs: avgs, stds: stds, sems: sems };

    return basic_stats;
}

function computePmaStats(subject_group, num_intervals) {
    const avgs = [];
    const stds = [];
    const sems = [];

    const metric_names = ['frequency-', 'duration-'];
    for (let metric_name of metric_names) {
        for (let bp of current_experiment.behaviour_parameters) { // for each parameter
            for (let interval = 0; interval < num_intervals; interval++) { // for each interval
                const metrics = [];
                for (subject of subject_group.subject_group) { // for each subject
                    const metric = subject.pma_stats[interval][metric_name + bp.behaviour];

                    metrics.push(metric);
                }

                const avg = arrAvg(metrics);
                const std = arrSTD(metrics);
                const sem = std / Math.sqrt(metrics.length);

                avgs.push(avg);
                stds.push(std);
                sems.push(sem);
            }

        }
    }

    subject_group['pma_stats'] = { avgs: avgs, stds: stds, sems: sems };
}