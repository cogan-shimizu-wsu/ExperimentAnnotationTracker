
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

function clearTitleAndHideForms() {
    let forms = [addNewExperimentForm, currentExperimentForm, addNewSubjectForm, viewAllSubjects,
        behaviourParametersForm, scoringForm, analysisForm];

    function hideForm(form) {
        form.style.display = 'none';
    };

    leftTitle.style.display = 'none';
    forms.forEach(hideForm);

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

    current_experiment = result;

    // Populate Experiment Metadata
    populateExperimentMetadata(current_experiment.experiment_data);
    // Populate Existing Subjects
    populateExistingSubjects(current_experiment.subjects_data);
    // Populate with Scoring Data

}

function populateExperimentMetadata(experiment_data) {
    // Name
    const currentExperimenterNameField = document.getElementById('current-experimenter-name-field');
    currentExperimenterNameField.value = experiment_data.name;
    // Date
    const currentExperimentDateField = document.getElementById('current-experiment-date-field');
    currentExperimentDateField.value = experiment_data.date;
}

function populateExistingSubjects(subjects_data) {
    subjects_data.forEach(subject => addNewSubject('', subject));
}

const currentExperimentOption = document.getElementById('current-experiment-option');
currentExperimentOption.addEventListener(
    'click',
    function showNewExperimentForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Modify Current Experiment';
        leftTitle.style.display = '';
        currentExperimentForm.style.display = '';
    }
);

const addNewSubjectOption = document.getElementById('add-new-subject-option');
addNewSubjectOption.addEventListener(
    'click',
    function showSubjectsForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'Add New Subject';
        leftTitle.style.display = '';
        addNewSubjectForm.style.display = '';
    }
);

const viewAllSubjectsOption = document.getElementById('view-all-subjects-option');
viewAllSubjectsOption.addEventListener(
    'click',
    function showSubjectsForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = 'All Subjects';
        leftTitle.style.display = '';
        viewAllSubjects.style.display = '';
    }
);

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

/** This Function has a side effect of clearing the data from the form after collection */
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

    // Finish
    return fieldValues;
}

function addNewSubject(temp, target_source = 'form') {
    const viewAllSubjectsBody = document.querySelector('#view-all-subjects-table-body');

    let tableRow = createSubjectRow(target_source);

    // Add the table row to the table
    viewAllSubjectsBody.insertAdjacentHTML('beforeend', tableRow.outerHTML);
}

const addBehaviourParameterButton = document.getElementById('add-behaviour-parameter-button');
let bpRowCounter = 0;
let behaviourParameters = [];
addBehaviourParameterButton.addEventListener(
    'click',
    addBehaviourParameterRow
);

function addBehaviourParameterRow(e, key, behaviour) {
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
                <input type='text' id='behaviour-parameter-row-${index.text}-behaviour' placeholder='Behaviour'>
              </div>
              <i class='close icon' id='behaviour-parameter-row-close-icon-${index.text}'></i>
          </div>
          `
    );
    // Create a way to delete this behaviour parameter, if necessary.
    let id = 'behaviour-parameter-row-close-icon-'.concat(bpRowCounter);
    let behaviourParameterRowCloseIcon = document.querySelector('#behaviour-parameter-row-close-icon-'.concat(bpRowCounter));
    behaviourParameterRowCloseIcon.addEventListener(
        'click',
        function removeBehaviourParameterRow() {
            // Get the row
            let behaviourParameterRow = behaviourParameterRowCloseIcon.parentElement.parentElement;
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
    // Using the unique ID, create an entry in the behaviour parameters collection
    let behaviourParameter = { key: "", behaviour: "", id: `behaviour-parameter-row-${index.text}` };
    behaviourParameters[bpRowCounter] = behaviourParameter;

    // Increment counter
    bpRowCounter++;
}

const registerBehaviourParametersButton = document.getElementById('register-behaviour-parameters-button');
registerBehaviourParametersButton.addEventListener(
    'click',
    registerAllBehaviourParameters
);

function registerAllBehaviourParameters() {

    let keydownHandlers = {};

    /** This private function is used for registering individual behaviour parameters */
    function registerBehaviourParameter(behaviourParameter) {

        // Get the key and behaviour from the specific behaviourParameterRow
        let behaviourParameterKeyField = document.getElementById(behaviourParameter.id + "-key");
        let key = behaviourParameterKeyField.value;
        let behaviourParameterBehaviourField = document.getElementById(behaviourParameter.id + "-behaviour");
        let behaviour = behaviourParameterBehaviourField.value;

        // Check if the key field value is reasonable (i.e. non-empty and exactly one character)
        if (key !== "" && key.length === 1) {
            /* Begin registration */

            // Register in datastructure
            behaviourParameter.key = key;
            behaviourParameter.behaviour = behaviour;

            // Begin Register event handlers


            // Create event handler
            let keydownHandler = function () {
                // debug
                console.log(key);
                // update frequency

                // update duration

                // update mean duration

                // update sd
            }

            // Add to the handler "multiplexer"
            keydownHandlers[key.toUpperCase()] = keydownHandler;

            /* Add to scoring session table body */
            // Get the reference to the table body
            const scoringSessionTableBody = document.getElementById('scoring-session-table-body');
            let tr = document.createElement('tr');
            let theads = ['key', 'behaviour', 'frequency', 'duration', 'mean-duration', 'sd'];
            let cells = [];
            function createCell(datalabel) {
                let cell = document.createElement('td');
                cell.setAttribute('data-label', datalabel);
                cells.push(cell);
            }
            // Create the cells with their data labels
            theads.forEach(createCell);
            // Manually set the data for the first two cells
            // the other cells will be populated dynamically 
            cells[0].innerText = key;
            cells[1].innerText = behaviour;
        }
    }

    // Register all the beavhiour parameters
    behaviourParameters.forEach(registerBehaviourParameter);

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