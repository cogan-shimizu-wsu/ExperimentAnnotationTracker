class SubjectGroup {
    constructor(subject_group) {
        this.subject_group = subject_group;
        this.basic_stats = computeBasicStats(subject_group);
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
    $.each($('input[id=per-minute-analysis]:checked'), function() {
       temp = true; 
    })
    return temp;
}

function oneWayAnalysisGrouping() {
    // Get the reference to the dropdown and extract the value
    const oneWayAnalysisDropdown = $('#1-way-analysis-dropdown');
    const parameter = oneWayAnalysisDropdown.dropdown('get value');

    if (parameter !== "") {
        // Group the subjects by the parameter
        return groupSubjects(parameter);
    }
    else {
        window.alert('Please choose a parameter.');
    }
}

function twoWayAnalysis() {
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
        let results;

        return results;
    }
}

function perMinuteAnalysis(grouping) {
    // Get reference and extract interval value
    const analysisIntervalField = document.getElementById('analysis-interval-field');
    const interval = analysisIntervalField.value;

    // For each subject group
    for (let group of grouping) {
        // For each subject in that group
        for (let subject of group) {
            let pmaStats = pmaForSubject(interval, subject);
        }
    }
}

function pmaForSubject(interval, subject) {
    // construct the pma data structure
    pmaStats = constructPmaStats(interval);

    // We want a reversed version of the timeline, 
    // but we don't want to mutate the original one
    const timeline = subject.scoring_timeline.slice(0).reverse().map(event => {
        // We also want the time to ascend, so we flip the event times around the 
        // max score length
        // i.e. 300 - 298 = 2nd second
        event.time = current_experiment.scoring_session_length - event.time;
        return event;
    });
    // It might be possible to remove splice, and switch reverse and map to get the same result

    let curr_minute = 0;
    let prev_behaviour;
    for (let event of timeline) {
        // This means the behaviour has ended
        if (prev_behaviour !== undefined) {
            // Check to see what minute the event is taking place in
            let event_minute = Math.floor(event.time / 60);
            if (curr_minute === event_minute) {
                // Update the frequency for scored behaviour with 
                // respect to the minute.
                pmaStats[curr_minute]['frequency-' + event.event] += 1;
            }
            else {
                // If it does not match, we need to catch up
                for (; curr_minute < event_minute; curr_minute++) {
                    pmaStats[curr_minute]['frequency-' + event.event] += 1;
                }
            }
        }
        // Update
        prev_behaviour = event.event;
    }

    return pmaStats;
}

/*
This creates a data struture of the form
pmaStats = {
    0: {
        f-bp1: 0,
        f-bp2: 0,
        .
        .
        .
    },
    .
    .
    .
}
*/
function constructPmaStats(interval) {
    // Calculate number of minutes
    const num_minutes = interval / 60; // it is assumed that interval is always a multiple of 60

    let pmaStats = [];

    for (let i = 0; i < num_minutes; i++) {
        // 
        let minute = {};
        for (bp of current_experiment.behaviour_parameters) {
            let bpString = 'frequency-' + bp.behaviour;
            minute[bpString] = 0;
        }
        // add to pmaStats
        pmaStats.push(minute);
    }

    return pmaStats;
}

function analyzeExperiment() {
    const analysisType = getAnalysisType();
    const isPma = checkPma();

    let results;
    if (analysisType === '1-way-analysis') {
        const grouping = oneWayAnalysisGrouping();

        let csv_string;
        if (isPma === true) {
            csv_string = perMinuteAnalysis(grouping);
        }
        else {
            csv_string = create_analysis_csv(grouping);
        }
        // debug
        console.log(csv_string);
    }
    else if (analysisType === '2-way-analysis') {
        results = twoWayAnalysis();
    }
    else {
        console.error('Something went wrong with analysis type.');
    }

    if (results !== undefined) {
        console.log('Experiment is Analyzed!');
        console.log(results);
    }
}


// Register the event listener for the button click
analyzeButton.addEventListener(
    'click',
    analyzeExperiment
);

/****************************************************************************/
function groupSubjects(parameter) {
    // Get a reference to all the subjects in the current_experiment
    const subjects_data = current_experiment.subjects_data;
    // This will hold all the distinct groups
    let grouped_subjects = {};

    for (let subject of subjects_data) {

        console.log(subject);

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
        let mean_durations = [];
        let sds = [];

        for (let subject of subject_group) {
            const individual_bp = subject.scoring_data[bp.key];


            frequencies.push(individual_bp.frequency);
            mean_durations.push(individual_bp['mean duration']);
            sds.push(individual_bp.sd);
        }

        const avg_frequency = arrAvg(frequencies);
        const avg_mean_duration = arrAvg(mean_durations);
        const avg_sd = arrAvg(sds);

        avgs.push(avg_frequency);
        avgs.push(avg_mean_duration);
        avgs.push(avg_sd);

        const std_frequency = arrSTD(frequencies);
        const std_mean_duration = arrSTD(mean_durations);
        const std_sd = arrSTD(sds);

        stds.push(std_frequency);
        stds.push(std_mean_duration);
        stds.push(std_sd);

        const sem_frequency = std_frequency / Math.sqrt(frequencies.length);
        const sem_mean_duration = std_mean_duration / Math.sqrt(mean_durations.length);
        const sem_sd = std_sd / Math.sqrt(sds.length);

        sems.push(sem_frequency);
        sems.push(sem_mean_duration);
        sems.push(sem_sd);
    }

    const basic_stats = { avgs: avgs, stds: stds, sems: sems };

    return basic_stats;
}