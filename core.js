class Experiment {
    constructor(experiment_data, subjects_data, behaviour_parameters) {
        this.experiment_data = experiment_data;
        this.subjects_data = subjects_data;
        this.behaviour_parameters = behaviour_parameters;
    };

    addSubject(subject) {
        this.subjects_data.push(subject);
    }
}

class Subject {
    constructor() {
        this.subject_id = "";
        this.genotype = "";
        this.sex = "";
        this.group = "";
        this.treatment = "";
        this.comment = "";
        this.scoring_data = {};
    }

    setFields(fieldValues) {
        this.subject_id = fieldValues[0];
        this.genotype = fieldValues[1];
        this.sex = fieldValues[2];
        this.group = fieldValues[3];
        this.treatment = fieldValues[4];
        this.comment = fieldValues[5];
    }

    addBehaviourParameter(key, behaviourParameter) {
        scoring_data[key] = behaviourParameter;
    }
}

class BehaviourParameter {
    constructor(key, behaviour, id) {
        this.behavior = behaviour;
        this.frequency = 0;
        this.durations = [];
        this.mean_duration = 0;
        this.sd = 0;
        this.key = key;
        this.id = id;
    }
}

// Global variable for the experiment
let current_experiment = new Experiment([], [], []);

/* Export Functionality */

// Get References to the menu options
const exportExperimentConsoleOption = document.getElementById('export-experiment-console-option');
const exportExperimentJsonOption = document.getElementById('export-experiment-json-option');
const exportExperimentCsvOption = document.getElementById('export-experiment-csv-option');
// Get reference to the export button
const exportButton = document.getElementById('export-button');

// Function for packaging the current_experiment into a file
function packageDownload(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Specific export medium handlers
function exportExperimentConsole() {
    const experiment_as_json = JSON.stringify(current_experiment);

    console.log(experiment_as_json);
}

function exportExperimentJson() {
    const filename = 'experiment.json'; // default name
    const text = JSON.stringify(current_experiment);

    packageDownload(filename, text);
}

function exportExperimentCsv() {
    const filename = 'experiment.csv'; // default name
    const text = JSON.stringify(current_experiment);

    // TODO insert csv specific code

    const csv_string = create_header_row() + create_subject_rows();
    console.log(csv_string);
    // packageDownload(filename, csv_string);
}

// Register the event handlers per option
exportExperimentConsoleOption.addEventListener(
    'click',
    exportExperimentConsole
);

exportExperimentJsonOption.addEventListener(
    'click',
    exportExperimentJson
);

exportExperimentCsvOption.addEventListener(
    'click',
    exportExperimentCsv
)

exportButton.addEventListener(
    'click',
    exportExperimentCsv
)

/* Drop Down Functionality */
$(document)
    .ready(function () {
        $('.ui.menu .ui.dropdown').dropdown({
            on: 'hover'
        });

        $('.ui.form .ui.dropdown').dropdown({
            on: 'hover'
        });
        
        $('.ui.menu a.item')
            .on('click', function () {
                $(this)
                    .addClass('active')
                    .siblings()
                    .removeClass('active')
                    ;
            })
            ;
    })
    ;

$(document).ready(function () {
    $('.tabular.menu .item').tab();
    $('select.dropdown').dropdown();
    $('ui.dropdown').dropdown();
});