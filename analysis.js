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
        let results;

        results = group_subjects(parameter);

        return results;
    }
    else {
        window.alert('Please choose a parameter.');
    }

    console.log(parameter);
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
function group_subjects(parameter) {
    // Get a reference to all the subjects in the current_experiment
    const subjects_data = current_experiment.subjects_data;
    // This will hold all the distinct groups
    let subject_groups = {};

    for (let subject of subjects_data) {

        console.log(subject);

        // What is the value of the parameter (e.g. Male, Female)
        let parameter_value = subject[parameter];

        // If there is a subject_group defined by that parameter value, just add this
        if (subject_groups.hasOwnProperty(parameter_value)) {
            subject_groups[parameter_value].push(subject);
        }
        else {
            let group = [];
            group.push(subject);

            subject_groups[parameter_value] = group;
        }
    }

    return subject_groups;
}