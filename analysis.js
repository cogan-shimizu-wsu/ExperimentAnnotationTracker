class SubjectGroup {
    constructor(subject_group)
    {
        this.subject_group = subject_group;
        this.basic_stats = computeBasicStats(subject_group);
    }
}


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

function oneWayAnalysis() {
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

function perMinuteAnalysis() {
    const analysisIntervalField = document.getElementById('analysis-interval-field');
    const interval = analysisIntervalField.value;
}

function analyzeExperiment() {
    const analysisType = getAnalysisType();

    let results;
    if (analysisType === '1-way-analysis') {
        results = oneWayAnalysis();

        let csv_string = create_analysis_csv(results);

        console.log(csv_string);

    }
    else if (analysisType === '2-way-analysis') {
        results = twoWayAnalysis();
    }
    else if (analysisType === 'per-minute-analysis') {
        results = perMinuteAnalysis();
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