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
let current_experiment = new Experiment([],[],[]);

// Export functionality
const exportCurrentExperimentOption = document.getElementById('export-current-experiment-option');
const exportButton = document.getElementById('export-button');

function exportCurrentExperiment() {
    const experiment_as_json = JSON.stringify(current_experiment);

    console.log(experiment_as_json);
}

exportCurrentExperimentOption.addEventListener(
    'click',
    exportCurrentExperiment
)

exportButton.addEventListener(
    'click',
    exportCurrentExperiment
)