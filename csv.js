// all data should be stored in current_experiment

const subject_characteristics = ['subject_id', 'genotype', 'sex', 'treatment',
    'group', 'comment'];
const stat_types = ['frequency', 'duration', 'sd'];

let key_order;

function create_header_row() {
    // Init
    key_order = [];
    // Empty list for the header row
    let header_row = [];
    // Populate with first elements
    subject_characteristics.forEach(sc => header_row.push(sc));


    function create_bp_stat_headers(bp) {
        // return stat_types.map(st => {return st + '-' + bp;});
        let temp = [];
        stat_types.forEach(st => {
            temp.push(st + '-' + bp);
        });
        return temp;
    }

    // console.log(current_experiment.behaviour_parameters);
    current_experiment.behaviour_parameters.forEach(bp => {
        // Keep track of the order 
        key_order.push(bp.key);
        // Get behaviour
        const behaviour = bp.behaviour;

        const stat_header = create_bp_stat_headers(behaviour);
        stat_header.forEach(sh => header_row.push(sh));
    });

    const header_row_string = header_row.join(',') + '\n';

    return header_row_string;
}

function create_subject_rows() {
    let subject_rows_string = '';

    current_experiment.subjects_data.forEach(s => {
        subject_rows_string += create_subject_row(s);
    });

    return subject_rows_string;
}

function create_subject_row(subject) {
    let subject_row_string = '';

    subject_characteristics.forEach(sc => {
        subject_row_string += subject[sc] + ',';
    });

    // For each key (in order)
    key_order.forEach(k => {
        // Get reference to the behaviour
        const bp = subject.scoring_data[k];

        // Extract desired info
        subject_row_string += bp['frequency'] + ',';
        subject_row_string += bp['mean duration'] + ',';
        subject_row_string += bp['sd'] + ',';
    })

    subject_row_string += '\n';

    return subject_row_string;
}

