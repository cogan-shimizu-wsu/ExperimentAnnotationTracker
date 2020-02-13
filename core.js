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
    constructor()
    {
        this.subject_id = "";
        this.genotype = "";
        this.sex = "";
        this.group = "";
        this.treatment = "";
        this.comment = "";
        this.scoring_data = [];
    }

    setFields(fieldValues)
    {
        this.subject_id = fieldValues[0];
        this.genotype = fieldValues[1];
        this.sex = fieldValues[2];
        this.group = fieldValues[3];
        this.treatment = fieldValues[4];
        this.comment = fieldValues[5];
    }
}

let experiment_data = {name: "Crags", date:"02/09/2020"};
let subjects_data = [
    {
        subject_id: "Mouse #1",
        genotype: "Blah",
        sex: "Male",
        group: "1",
        treatment: "SARS",
        comment: "N/A"
    },
    {
        subject_id: "Mouse #2",
        genotype: "Bleh",
        sex: "Female",
        group: "2",
        treatment: "AIDS",
        comment: "N/A"
    }
]

let behaviour_parameters = [
    {
        "key": "A",
        "behaviour": "Grooming",
    },
    {
        "key": "2",
        "behaviour": "Dining",
    }
];

let current_experiment = new Experiment(experiment_data,subjects_data,behaviour_parameters);

console.log(JSON.stringify(current_experiment));

