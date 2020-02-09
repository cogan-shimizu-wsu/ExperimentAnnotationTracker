class Experiment {
    constructor(experiment_data, subjects_data, scoring_data) {
        this.experiment_data = experiment_data;
        this.subjects_data = subjects_data;
        this.scoring_data = scoring_data;
    };
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

let scoring_data = {};

let current_experiment = new Experiment(experiment_data,subjects_data,scoring_data);

console.log(JSON.stringify(current_experiment));

