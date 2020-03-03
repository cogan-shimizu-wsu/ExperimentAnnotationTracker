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

function create_subject_rows(source) {
    let subject_rows_string = '';

    source.forEach(s => {
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
        subject_row_string += bp['mean_duration'] + ',';
        subject_row_string += bp['sd'] + ',';
    })

    subject_row_string += '\n';

    return subject_row_string;
}

function create_basic_stat_rows(basic_stats) {
    let basic_stat_rows_string = '';

    for (let basic_stat of Object.values(basic_stats)) {
        basic_stat_rows_string += create_basic_stat_row(basic_stat);
    }

    return basic_stat_rows_string;
}

function create_basic_stat_row(basic_stat) {
    const buffer = ','.repeat(5);

    const basic_stat_string = basic_stat.join(',');

    const full_string = buffer + basic_stat_string + '\n';

    return full_string;
}

function createBlankLine() {
    let blank_line = ',';
    blank_line = blank_line.repeat(6 + 3 * current_experiment.behaviour_parameters.length);
    blank_line += '\n';

    return blank_line;
}

function createBlankPmaLine(num_intervals) {
    let blank_line = ',';
    const num_cols = 6 + (2 * current_experiment.behaviour_parameters.length * num_intervals);
    blank_line = blank_line.repeat(num_cols);
    blank_line += '\n';
    return blank_line;
}

function create_analysis_csv(subject_groups) {
    let csv_string = create_header_row();
    const blank_line = createBlankLine();
    for (let subject_group of subject_groups) {
        const subject_group_string = create_subject_rows(subject_group.subject_group);
        const subject_group_stats_string = create_basic_stat_rows(subject_group.basic_stats);
        csv_string += subject_group_string + subject_group_stats_string + blank_line;
    }

    return csv_string;
}

function create_pma_header_row(num_intervals) {
    // Empty list for the header row
    let header_row = [];
    // Populate with first elements
    subject_characteristics.forEach(sc => header_row.push(sc));

    // First do frequencies
    for (let bp of current_experiment.behaviour_parameters) {
        for (let i = 0; i < num_intervals; i++) {
            let heading = 'frequency-';
            heading += bp.behaviour;
            heading += ' T' + i;
            header_row.push(heading);
        }
    }

    // Then do durations
    for (let bp of current_experiment.behaviour_parameters) {
        for (let i = 0; i < num_intervals; i++) {
            let heading = 'duration-';
            heading += bp.behaviour;
            heading += ' T' + i;
            header_row.push(heading);
        }
    }

    const header_row_string = header_row.join(',') + '\n';

    return header_row_string;
}

function create_subject_pma_rows(subject_group) {
    let subject_pma_rows_string = '';

    for (let subject of subject_group) {
        subject_pma_rows_string += create_subject_pma_row(subject);
    }

    return subject_pma_rows_string;
}

function create_subject_pma_row(subject) {
    const num_intervals = subject.pma_stats.length;
    let subject_string = '';

    // do subject characteristics
    for (let sc of subject_characteristics) {
        subject_string += subject[sc] + ',';
    }

    // first do frequencies
    for (let interval = 0; interval < num_intervals; interval++) {
        let stat = subject.pma_stats[interval];
        
        for(let bp of current_experiment.behaviour_parameters) {
            subject_string += stat['frequency-'+bp.behaviour] + ',';
        }
    }
    
    // then do durations
    for (let interval = 0; interval < num_intervals; interval++) {
        let stat = subject.pma_stats[interval];
        
        for(let bp of current_experiment.behaviour_parameters) {
            subject_string += stat['duration-'+bp.behaviour] + ',';
        }
    }

    subject_string += '\n';

    return subject_string;
}

function create_subject_pma_stat_rows(subject_group) {
    let subject_pma_stat_rows_string = '';
    const buffer = ','.repeat(5);

    for (let aggregate_pma_stat of Object.values(subject_group.pma_stats)) {
        subject_pma_stat_rows_string += buffer + aggregate_pma_stat.join(',') + '\n';
    }

    return subject_pma_stat_rows_string;
}

function create_analysis_pma_csv(subject_groups) {
    /* This num_intervals code is copy and pasted from the perMinuteAnalysis function in analysis.js*/
    // Get reference and extract interval value
    // const analysisIntervalField = document.getElementById('analysis-interval-field');
    const interval = 60; //Number.parseInt(analysisIntervalField.value);
    const num_intervals = current_experiment.scoring_session_length / interval;

    // Create header row (specific to pma)
    let csv_string = create_pma_header_row(num_intervals);
    const blank_pma_line = createBlankPmaLine(num_intervals);
    for (let subject_group of subject_groups) {
        const subject_group_string = create_subject_pma_rows(subject_group.subject_group);
        const subject_group_stats_string = create_subject_pma_stat_rows(subject_group);

        csv_string += subject_group_string + subject_group_stats_string + blank_pma_line;
    }

    return csv_string;
}