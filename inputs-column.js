
/* *********************************************************************************** */
// Title of the left pane
const leftTitle = document.getElementById('left-title');
// Objects of all the forms
const addNewExperimentForm = document.getElementById('add-new-experiment-form');
const currentExperimentForm = document.getElementById('current-experiment-form');
const addNewSubjectForm = document.getElementById('add-new-subject-form');
const viewAllSubjects = document.getElementById('view-all-subjects');
const behaviourParametersForm = document.getElementById('behaviour-parameters-form');
const scoringForm = document.getElementById('scoring-form');
const analysisForm = document.getElementById('analysis-form');

// Utilities
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const sqrDif = (arr, avg) => arr.map(function (value) {
    let diff = value - avg;
    let sqrDiff = diff * diff;
    return sqrDiff;
});
const arrSTD = arr =>
    Math.sqrt(sqrDif(arr, arrAvg(arr)) // Create list of the sqr differences
        .reduce((a, b) => a + b, 0) // Sum them
        / (arr.length - 1)); // Divide by N- 1
// SEE https://wikimedia.org/api/rest_v1/media/math/render/svg/067067e579e43b39ca1e57d9be52bda5b80cd284


// Tracker for last scored behaviour
let lastScoredBehaviour;
let isScoringEnd = false;
let lastScoredTime;
let activeSubject;
let scoringTabActive = false;

function clearTitleAndHideForms() {
    let forms = [addNewExperimentForm, currentExperimentForm, addNewSubjectForm, //viewAllSubjects,
        behaviourParametersForm, scoringForm, analysisForm];

    function hideForm(form) {
        form.style.display = 'none';
    };

    leftTitle.style.display = 'none';
    forms.forEach(hideForm);

    scoringTabActive = false;
};

const addNewExperimentOption = document.getElementById('add-new-experiment-option');
addNewExperimentOption.addEventListener(
    'click',
    function showNewExperimentForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Create New Experiment';
        leftTitle.style.display = '';
        addNewExperimentForm.style.display = '';
    }
);

const updateNewExperimentButton = document.getElementById('update-new-experiment-button');
updateNewExperimentButton.addEventListener(
    'click',
    function () {
        const experimentNameLabel = document.getElementById('experiment-name-label');
        const experimentNameField = document.getElementById('experiment-name-field');
        const experimentDateField = document.getElementById('experiment-date-field');
        // update current_experiment
        const experimentNameValue = experimentNameField.value;
        const experimentDateValue = experimentDateField.value;
        current_experiment.experiment_data["name"] = experimentNameValue;
        current_experiment.experiment_data["date"] = experimentDateValue;
        // update label
        experimentNameLabel.innerHTML = experimentNameValue;
    }
);

const openExistingExperimentOption = document.getElementById('open-existing-experiment-option');
openExistingExperimentOption.addEventListener(
    'click',
    function openExperiment() {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = function () {
            let file = input.files[0];
            let fr = new FileReader();
            fr.onload = parseExperimentFile;
            fr.readAsText(file);
        }

        input.click();
    }
)

function parseExperimentFile(e) {
    let lines = e.target.result;
    let result = JSON.parse(lines);

    current_experiment = new Experiment(result.experiment_data, result.subjects_data, result.behaviour_parameters);
    current_experiment.scoring_session_length = result.scoring_session_length;
    // Populate Experiment Metadata
    populateExperimentMetadata(current_experiment.experiment_data);
    // Populate Existing Subjects
    populateExistingSubjects(current_experiment.subjects_data);
    // Populate with Scoring Data
    populateBehaviourParameters(current_experiment.behaviour_parameters);
}

function populateExperimentMetadata(experiment_data) {
    // Name
    const experimentNameField = document.getElementById('experiment-name-field');
    experimentNameField.value = experiment_data.name;
    // Date
    const experimentDateField = document.getElementById('experiment-date-field');
    experimentDateField.value = experiment_data.date;
    // Update Label
    const experimentNameLabel = document.getElementById('experiment-name-label');
    experimentNameLabel.innerHTML = experiment_data.name;
}

function populateExistingSubjects(subjects_data) {
    document.querySelector('#view-all-subjects-table-body').innerHTML = '';
    subjects_data.forEach(subject => addNewSubject('', subject));
}

function populateBehaviourParameters(behaviour_parameters) {
    // Add the behaviour parameter rows
    behaviour_parameters.forEach(bp => addBehaviourParameterRow('', bp.key, bp.behaviour));
    // Register them
    registerAllBehaviourParameters();
}

// const currentExperimentOption = document.getElementById('current-experiment-option');
// currentExperimentOption.addEventListener(
//     'click',
//     function showNewExperimentForm() {
//         clearTitleAndHideForms();
//         leftTitle.innerHTML = 'Modify Current Experiment';
//         leftTitle.style.display = '';
//         currentExperimentForm.style.display = '';
//     }
// );

const addNewSubjectOption = document.getElementById('add-new-subject-option');
addNewSubjectOption.addEventListener(
    'click',
    function showSubjectsForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Add or Change Subject';
        leftTitle.style.display = '';
        addNewSubjectForm.style.display = '';
    }
);

// const viewAllSubjectsOption = document.getElementById('view-all-subjects-option');
// viewAllSubjectsOption.addEventListener(
//     'click',
//     function showSubjectsForm() {
//         clearTitleAndHideForms();
//         leftTitle.innerHTML = 'All Subjects';
//         leftTitle.style.display = '';
//         viewAllSubjects.style.display = '';
//     }
// );

const behaviourParametersOption = document.getElementById('behaviour-parameters-option');
behaviourParametersOption.addEventListener(
    'click',
    function showBehaviorParametersForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Behaviour Parameters';
        leftTitle.style.display = '';
        behaviourParametersForm.style.display = '';
    }
);

const scoringOption = document.getElementById('scoring-option');
scoringOption.addEventListener(
    'click',
    function showScoringForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Scoring';
        leftTitle.style.display = '';
        scoringForm.style.display = '';
    }
);

const analysisOption = document.getElementById('analysis-option');
analysisOption.addEventListener(
    'click',
    function showAnalysisForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Analysis';
        leftTitle.style.display = '';
        analysisForm.style.display = '';
    }
);

const addNewSubjectButton = document.getElementById('add-new-subject-button');
addNewSubjectButton.style.display = '';
addNewSubjectButton.addEventListener(
    'click',
    addNewSubject);

function createTableCells() {

    // These are the fields that we can programmatically access easily (i.e. in a loop)
    let fields = [
        '#subject-id-field',
        '#genotype-field',
        '#sex-value-dropdown',
        '#group-field',
        '#treatment-field',
        '#comment-field',];

    let tableCells = [];
    function createTableCellForField(fieldID) {
        // create table cell
        let tableCell = document.createElement('td');
        // create data-label
        let temp = fieldID.split('-');
        let dataLabel = temp.slice(1, temp.length - 1).join('-');
        // set data-label attribute
        tableCell.setAttribute('data-label', dataLabel);
        // done
        tableCells.push(tableCell);
    }

    // Create the cells (they're appended to the tableCells array)
    fields.forEach(createTableCellForField);

    // Finish
    return tableCells;
}

function createSubjectRow(source) {
    // Create the table cells
    let tableCells = createTableCells();
    // Create the table row
    let tableRow = document.createElement('tr');

    let subject_data = 1;

    if (source === 'form') {
        subject_data = getSubjectDataFromForm();
    }
    else {
        subject_data = [];

        Object.values(source).forEach(value => subject_data.push(value));
    }

    // Add all cells into the row
    function addToTableRow(tableCell) {
        tableRow.insertAdjacentHTML('beforeend', tableCell.outerHTML);
    };

    for (let i = 0; i < 6; i++) {
        tableCell = tableCells[i].innerText = subject_data[i];
    }

    tableCells.forEach(addToTableRow);

    return tableRow;
}

/** 
 * This Function has a side effect of clearing the data from the form after collection
 * This Function has a side effect of adding the subject to the current_experiment data structure
 */
function getSubjectDataFromForm() {
    // These are the fields that we can programmatically access easily (i.e. in a loop)
    let fields = [
        '#subject-id-field',
        '#genotype-field',
        '#group-field',
        '#treatment-field',
        '#comment-field',];

    let fieldValues = [];
    function getValueFromField(fieldID) {
        // Get field element
        let field = document.querySelector(fieldID);
        // Get data from field
        let fieldValue = field.value;
        // Clear original field
        field.value = '';
        // done
        fieldValues.push(fieldValue);
    }

    // Loop through
    fields.forEach(getValueFromField);

    // Do dropdown
    let sexDropdown = $('#sex-value-dropdown');
    // Get data from form
    let sexValue = sexDropdown.dropdown('get value');

    // Splice it into the table Cells
    fieldValues.splice(2, 0, sexValue);

    // Add the generated subject to the current_experiment
    let subject = new Subject();
    subject.setFields(fieldValues);
    current_experiment.addSubject(subject);

    for (let bp of current_experiment.behaviour_parameters) {
        if (subject.scoring_data.hasOwnProperty(bp.key) === false) {
            subject.scoring_data[bp.key] = Object.assign({}, bp);
        }
    }

    // Finish
    return fieldValues;
}

function addNewSubject(temp, target_source = 'form') {
    const subjectIdField = document.getElementById('subject-id-field');

    if (target_source === 'form' && (subjectIdField.value == null || subjectIdField.value.length == 0 || subjectIdField.value == undefined || subjectIdField.value == '')) {
        alert("Please enter a Subject ID and try again.");
    } else {
        const viewAllSubjectsBody = document.querySelector('#view-all-subjects-table-body');

        let tableRow = createSubjectRow(target_source);

        // Add the table row to the table
        viewAllSubjectsBody.insertAdjacentHTML('beforeend', tableRow.outerHTML);

        // Populate the search bar searcher thing
        populateSubjectSearches();
    }
}

const addBehaviourParameterButton = document.getElementById('add-behaviour-parameter-button');
let bpRowCounter = 0;
let behaviourParameters = [];
addBehaviourParameterButton.addEventListener(
    'click',
    addBehaviourParameterRow
);

addBehaviourParameterButton.style.margin = "10px";

function addBehaviourParameterRow(e, keyValue, behaviourValue) {
    // Find the parameter list
    let behaviourParameterList = document.querySelector('#behaviour-parameter-list');
    // Generate a unique id for the behaviour parameter
    let index = { text: bpRowCounter };
    // Create the row where the behaviour parameter can be entered
    behaviourParameterList.insertAdjacentHTML('beforeend',
        `
          <div id='behaviour-parameter-row-${index.text}'>
            <div class='inline fields'>
              <div class='four wide field'>
                <input type='text' id='behaviour-parameter-row-${index.text}-key' placeholder='Key'>
              </div>
              <div class='five wide field'>
                <input type='text' id='behaviour-parameter-row-${index.text}-behaviour' placeholder='Behaviour' style="width: 500px">
                <i class='close icon' id='behaviour-parameter-row-close-icon-${index.text}'></i>
              </div>
              
          </div>
          `
    );
    // Create a way to delete this behaviour parameter, if necessary.
    let id = 'behaviour-parameter-row-close-icon-'.concat(bpRowCounter);
    const behaviourParameterRowCloseIcon = document.querySelector('#behaviour-parameter-row-close-icon-'.concat(bpRowCounter));
    behaviourParameterRowCloseIcon.addEventListener(
        'click',
        function removeBehaviourParameterRow() {
            // Get the row
            const behaviourParameterRow = behaviourParameterRowCloseIcon.parentElement.parentElement;
            // Get the "unique" id
            let rowid = behaviourParameterRow.id;
            rowid = rowid.split('-');
            rowid = rowid[rowid.length - 1];
            // Remove it from the collection
            behaviourParameters.splice(rowid, 1);
            // Remove it from the DOM
            behaviourParameterRow.remove();
        }
    );

    if (keyValue === undefined) {
        keyValue = "";
    }
    else {
        document.getElementById(`behaviour-parameter-row-${index.text}-key`).value = keyValue;
    }
    if (behaviourValue === undefined) {
        behaviourValue = "";
    }
    else {
        document.getElementById(`behaviour-parameter-row-${index.text}-behaviour`).value = behaviourValue;
    }

    // Using the unique ID, create an entry in the behaviour parameters collection
    let behaviourParameter = new BehaviourParameter(keyValue, behaviourValue, `behaviour-parameter-row-${index.text}`);
    behaviourParameters[bpRowCounter] = behaviourParameter;

    // Increment counter
    bpRowCounter++;
}

const registerBehaviourParametersButton = document.getElementById('register-behaviour-parameters-button');
registerBehaviourParametersButton.addEventListener(
    'click',
    registerAllBehaviourParameters
);

registerBehaviourParametersButton.style.margin = "10px";

let keydownHandlers = {};

const currentBehaviorOutput = document.getElementById('currentBehaviorOutput');
const scoringResetButton = document.getElementById('scoring-reset-data-button');
scoringResetButton.addEventListener(
    'click',
    function () {

        // Nuke the scoring data for the Subject
        activeSubject.scoring_data = {};
        for (let bp of current_experiment.behaviour_parameters) {
            if (activeSubject.scoring_data.hasOwnProperty(bp.key) === false) {
                activeSubject.scoring_data[bp.key] = Object.assign({}, bp);
            }
        }

        // Repopulate scoring data?
        // For each behaviour parameter
        for (let bp of current_experiment.behaviour_parameters) {
            const metric_labels = ['frequency', 'total_duration', 'mean_duration', 'sd'];
            // For each metric
            for (let metric_label of metric_labels) {
                const metric_cell = document.getElementById(bp.key + '-' + metric_label);
                const metric_value = activeSubject.scoring_data[bp.key][metric_label];
                metric_cell.innerHTML = metric_value;
            }
        }
        // Nuke scoring_timeline
        activeSubject.scoring_timeline = [];
    }
)


function registerAllBehaviourParameters() {

    // Get the reference to the table body
    const scoringSessionTableBody = document.getElementById('scoring-session-table-body');
    scoringSessionTableBody.innerHTML = '';

    /** This private function is used for registering individual behaviour parameters */
    function registerBehaviourParameter(behaviourParameter) {

        // Get the key and behaviour from the specific behaviourParameterRow
        let behaviourParameterKeyField = document.getElementById(behaviourParameter.id + "-key");
        let key = behaviourParameterKeyField.value;
        let behaviourParameterBehaviourField = document.getElementById(behaviourParameter.id + "-behaviour");
        let behaviour = behaviourParameterBehaviourField.value;

        // Check if the key field value is reasonable (i.e. non-empty and exactly one character)
        if (key.length === 1) {

            /* Add to scoring session table body */
            let tableRow = document.createElement('tr');
            let theads = ['key', 'behaviour', 'frequency', 'total_duration', 'mean_duration', 'sd'];
            let cells = [];
            function createCell(datalabel) {
                let cell = document.createElement('td');
                cell.setAttribute('data-label', datalabel);
                cell.id = key + "-" + datalabel;
                cells.push(cell);
            }
            // Create the cells with their data labels
            theads.forEach(createCell);
            // Manually set the data for the first two cells
            // the other cells will be populated dynamically 
            cells[0].innerText = key;
            cells[1].innerText = behaviour;
            // Add all cells into the row
            function addToTableRow(tableCell) {
                tableRow.insertAdjacentHTML('beforeend', tableCell.outerHTML);
            };
            cells.forEach(addToTableRow);
            scoringSessionTableBody.insertAdjacentHTML('beforeend', tableRow.outerHTML);

            /* Begin registration */
            // Register in datastructure
            behaviourParameter.key = key;
            behaviourParameter.behaviour = behaviour;
            current_experiment.behaviour_parameters.push(behaviourParameter);
            // Begin Register event handlers

            // Create event handler
            let keydownHandler = function () {
                // Only do something if the scoring tab is active
                // We also want to not do anything if the same key has been struck twice in a row
                if (scoringTabActive === true && ((isScoringEnd === true) || (lastScoredBehaviour === undefined) || (lastScoredBehaviour.key !== key))) {
                    const countdownBox = document.getElementById('trackerInputBox');
                    let scoredTime = countdownBox.value;
                    if (scoredTime === '') {
                        scoredTime = 0;
                    }
                    currentBehaviorOutput.innerHTML = 'Current Behaviour Key: ' + key;

                    // Scoring occurs on the SECOND keystroke.
                    // That is, the first keystroke indicates that the behaviour has started
                    // The second keystroke means the behaviour has ended and a new behaviour has started
                    if (lastScoredBehaviour !== undefined) {
                        // Get the key from the last scored behaviour
                        const lastKey = lastScoredBehaviour.key;

                        // Add the behaviour parameter to the activeSubject if it doesn't have it.
                        if (activeSubject.scoring_data.hasOwnProperty(lastKey) === false) {
                            activeSubject.scoring_data[lastKey] = lastScoredBehaviour;
                        } // This should technically never be called, due to changes in how 
                        // behaviour parameters are added to subjects during registration.
                        // TODO: remove the above block.

                        // Add this 'event' to the timeline
                        const event = { time: scoredTime, event: lastScoredBehaviour.behaviour };
                        // Add the behaviour parameter to the activeSubject if it doesn't have it.
                        if (activeSubject.hasOwnProperty('scoring_timeline') === false) {
                            activeSubject['scoring_timeline'] = [];
                        }
                        activeSubject.scoring_timeline.push(event);

                        // Update the statistics
                        // Update Frequency
                        const frequencyCell = document.getElementById(lastKey + '-frequency');
                        activeSubject.scoring_data[lastKey].frequency++;
                        frequencyCell.innerText = activeSubject.scoring_data[lastKey].frequency;

                        // Update the Durations
                        // Calculate current duration
                        const duration = lastScoredTime - scoredTime;
                        activeSubject.scoring_data[lastKey].durations.push(duration);

                        // Update the last scored duration
                        const durationCell = document.getElementById(lastKey + '-total_duration');
                        activeSubject.scoring_data[lastKey].total_duration += duration;
                        durationCell.innerText = activeSubject.scoring_data[lastKey].total_duration;

                        // Calculate and Update the mean duration for this behaviour
                        const meanDurationCell = document.getElementById(lastKey + '-mean_duration');
                        const meanDuration = arrAvg(activeSubject.scoring_data[lastKey].durations);
                        activeSubject.scoring_data[lastKey].mean_duration = meanDuration;
                        meanDurationCell.innerText = meanDuration;


                        // Calculate and Update the standard deviation
                        const sdCell = document.getElementById(lastKey + '-sd');
                        const sdValue = arrSTD(activeSubject.scoring_data[lastKey].durations);
                        activeSubject.scoring_data[lastKey].sd = sdValue;
                        sdCell.innerText = sdValue;

                        // scoringResetButton.addEventListener('click', resetScoringDataInner);
                        // // Function resets data to 0 for frequency, duration, mean duration, and standard deviation when the corresponding button is pressed
                        // function resetScoringDataInner() {
                        //     frequencyCell.innerText = 0;
                        //     activeSubject.scoring_data[lastKey].frequency = 0;

                        //     durationCell.innerText = 0;
                        //     activeSubject.scoring_data[lastKey].total_duration = 0;

                        //     meanDurationCell.innerText = 0;
                        //     activeSubject.scoring_data[lastKey].mean_duration = 0;

                        //     sdCell.innerText = 0;
                        //     activeSubject.scoring_data[lastKey].sd = 0;
                        // }
                    }
                    // Now set the last scored behaviour
                    lastScoredBehaviour = behaviourParameter;
                    lastScoredTime = scoredTime;
                }
            }

            // Add to the handler "multiplexer"
            keydownHandlers[key.toUpperCase()] = keydownHandler;
        }
    }

    // Clear the Behaviour Parameters from current_experiment, they're about to be added back
    // in the following for loop. every time a behaviour parameter is registered,
    // We add it ot the current experiment. We clear it so that we don't accidentally
    // add multiple copies of the same bp to the list.
    current_experiment.behaviour_parameters = [];

    // Register all the beavhiour parameters
    behaviourParameters.forEach(registerBehaviourParameter);

    // Now that all behaviour parameters are updated, make sure all the subjects have them
    for (let subject of current_experiment.subjects_data) {
        for (let bp of current_experiment.behaviour_parameters) {
            if (subject.scoring_data.hasOwnProperty(bp.key) === false) {
                subject.scoring_data[bp.key] = Object.assign({}, bp);
            }
        }
    }

    /** This function is the keydownMultiplexor */
    function keydownMultiplexor(e) {
        // Strips away the "key" and "digit" from the key code
        let keydown = e.code;

        keydown = keydown.substring(keydown.length - 1); // i.e. keep the last character of the code
        // ^ it should also always be uppercase
        // Call the specific keydownHandler;

        // Only call if the key is actually in the keydownHandlers
        if (keydownHandlers.hasOwnProperty(keydown)) {
            keydownHandlers[keydown]();
        }
    }
    // register the multiplexed keydown handler function
    document.addEventListener(
        'keypress',
        keydownMultiplexor
    );
}

// For populating the Active Subject Table
function activeSubjectSelected(subject) {
    // Set the active subject.
    // This is necessary because the populateSubjectSearches function
    // Searches a COPY of the current_experiment.subjects_data
    // Thus disconnecting the reference chain.
    for (let i in current_experiment.subjects_data) {
        let temp = current_experiment.subjects_data[i];
        let temp_id = temp.subject_id;

        if (subject.subject_id === temp_id) {
            activeSubject = temp;
        }
    }
    // Get reference to the active subject table body
    const activeSubjectTableBody = document.getElementById('active-subject-table-body');
    // Clear active subject table body
    activeSubjectTableBody.innerHTML = '';
    // Create Table Row for the subject
    const tableRow = createSubjectRow(subject);
    // Add it to the active subject table body
    activeSubjectTableBody.innerHTML = tableRow.outerHTML;

    // If scoring data exists, populate it.
    // For each behaviour parameter
    for (let bp of current_experiment.behaviour_parameters) {
        const metric_labels = ['frequency', 'total_duration', 'mean_duration', 'sd'];
        // For each metric
        for (let metric_label of metric_labels) {
            const metric_cell = document.getElementById(bp.key + '-' + metric_label);
            const metric_value = activeSubject.scoring_data[bp.key][metric_label];
            metric_cell.innerHTML = metric_value;
        }
    }
}

function populateSubjectSearches() {
    // For finding the active subject
    $('#active-subject-search')
        .search({
            source: current_experiment.subjects_data,
            fields: { title: 'subject_id' },
            searchFields: [
                'subject_id'
            ],
            //   fullTextSearch: false
            onSelect: activeSubjectSelected
        });

    $('#edit-subject-search')
        .search({
            source: current_experiment.subjects_data,
            fields: { title: 'subject_id' },
            searchFields: [
                'subject_id'
            ],
            //   fullTextSearch: false
            onSelect: editSubjectSelected
        });
}

// Edit Subject Button
const editSubjectButton = document.getElementById('edit-subject-button');
editSubjectButton.addEventListener(
    'click',
    function () {
        // get name
        const subjectIdField = document.getElementById('subject-id-field');
        subject_id = subjectIdField.value;

        // get subject from subjects data
        let subject;
        for (let temp of current_experiment.subjects_data) {
            if (subject_id === temp.subject_id) {
                subject = temp;
                break;
            }
        }

        // Edit
        const genotypeField = document.getElementById('genotype-field');
        subject.genotype = genotypeField.value;

        const sexDropdown = $('#sex-value-dropdown');
        const sexValue = sexDropdown.dropdown('get value');
        subject.sex = sexValue;

        const groupField = document.getElementById('group-field');
        subject.group = groupField.value;

        const treatmentField = document.getElementById('treatment-field');
        subject.treatment = treatmentField.value;

        const commentField = document.getElementById('comment-field');
        subject.comment = commentField.value;

        // fix tables
        populateExistingSubjects(current_experiment.subjects_data);

        // clean up
        hideAndClearEditSubjectForm();
    }
);

// Cancel Edit Subject Button
const cancelEditSubjectButton = document.getElementById('cancel-edit-subject-button');
cancelEditSubjectButton.addEventListener(
    'click',
    hideAndClearEditSubjectForm
);

function hideAndClearEditSubjectForm() {
    // Show subject button
    addNewSubjectButton.style.display = '';

    // Hide Edit Button
    editSubjectButton.style.display = 'none';

    // Hide Cancel Button
    cancelEditSubjectButton.style.display = 'none';

    // Hide Delete Button
    deleteSubjectButton.style.display = 'none';

    // Clear form
    const field_ids = [
        '#subject-id-field',
        '#genotype-field',
        '#group-field',
        '#treatment-field',
        '#comment-field',];
    for (let field_id of field_ids) {
        const field = document.querySelector(field_id);
        field.value = '';
    }

    const sexDropdown = $('#sex-value-dropdown');
    sexDropdown.dropdown('restore placeholder text');

    const editSubjectInput = document.getElementById('edit-subject-input');
    editSubjectInput.value = '';
}

const deleteSubjectButton = document.getElementById('delete-subject-button');
deleteSubjectButton.addEventListener(
    'click',
    function () {
        const subjectIdField = document.getElementById('subject-id-field');
        const subject_id = subjectIdField.value;

        // Delete from data structure
        let delete_index;
        current_experiment.subjects_data.forEach(function (item, index, array) {
            if (item.subject_id === subject_id) {
                delete_index = index;
            }
        });
        current_experiment.subjects_data.splice(delete_index, 1);

        // clean up table
        populateExistingSubjects(current_experiment.subjects_data);

        // update the search bars so that you can't find it any more
        populateSubjectSearches();

        // clean up
        hideAndClearEditSubjectForm();
    }
);

function editSubjectSelected(subject) {
    // POPULATE
    const subjectIdField = document.getElementById('subject-id-field');
    subjectIdField.value = subject.subject_id;

    const genotypeField = document.getElementById('genotype-field');
    genotypeField.value = subject.genotype;

    const sexDropdown = $('#sex-value-dropdown');
    sexDropdown.dropdown('set text', subject.sex);
    sexDropdown.dropdown('set value', subject.sex);

    const groupField = document.getElementById('group-field');
    groupField.value = subject.group;

    const treatmentField = document.getElementById('treatment-field');
    treatmentField.value = subject.treatment;

    const commentField = document.getElementById('comment-field');
    commentField.value = subject.comment;

    // Hide the add new subject button
    addNewSubjectButton.style.display = 'none';

    // make the edit button visible
    editSubjectButton.style.display = '';

    // make the cancel button visible
    cancelEditSubjectButton.style.display = '';

    // make the delete button visible
    deleteSubjectButton.style.display = '';
}



/* Synchrony of Subjects in Analysis Tab */
// Get references
const syncButton = document.getElementById('sync-subjects');
const analysisSubjectsForm = document.getElementById('analysis-subjects-form');
syncButton.addEventListener(
    'click',
    populateAnalysisSubjects
);

// Function for populating the analysis interface with the subjects.
function populateAnalysisSubjects() {
    // Initially remove everything
    analysisSubjectsForm.innerHTML = '';
    // Repopulate
    current_experiment.subjects_data.forEach(subject => {
        createCheckBoxForSubject(subject);
    });
}

function createCheckBoxForSubject(subject) {
    // Create field div
    const inline_field = document.createElement('div');
    inline_field.setAttribute('class', 'inline field');
    // Create checkbox div
    const checkbox_holder = document.createElement('div');
    checkbox_holder.setAttribute('class', 'ui checkbox');
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'subject-checkbox');
    checkbox.setAttribute('data-value', subject.subject_id);
    // Get the label for the subject
    const subject_label = document.createElement('label');
    subject_label.innerHTML = subjectToString(subject);
    // Construct holder
    checkbox_holder.innerHTML = checkbox.outerHTML;
    checkbox_holder.innerHTML += subject_label.outerHTML;
    // Construct the Field
    inline_field.innerHTML = checkbox_holder.outerHTML;
    // Add to the form
    analysisSubjectsForm.innerHTML += inline_field.outerHTML;
}

const selectAllAnalysisSubjectsButton = document.getElementById('select-all-analysis-subjects');
selectAllAnalysisSubjectsButton.addEventListener(
    'click',
    selectAllCheckBoxes
);

function selectAllCheckBoxes() {
    checkboxes = document.getElementsByName('subject-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

function subjectToString(subject) {
    // Start
    let subject_string = '';
    // Construct
    subject_string += subject.subject_id + ' ';
    subject_string += subject.genotype + ' ';
    subject_string += subject.sex + ' ';
    // Return
    return subject_string;
}