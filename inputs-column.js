// test
$('select.dropdown').dropdown();

// Title of the left pane
const leftTitle = document.getElementById("left-title");
// Objects of all the forms
const addNewSubjectForm = document.getElementById("add-new-subject-form");
const viewAllSubjects = document.getElementById("view-all-subjects");
const behaviourParametersForm = document.getElementById("behaviour-parameters-form");
const scoringForm = document.getElementById("scoring-form");
const analysisForm = document.getElementById("analysis-form");

function clearTitleAndHideForms() {
    let forms = [addNewSubjectForm, viewAllSubjects,
        behaviourParametersForm, scoringForm, analysisForm];

    function hideForm(form) {
        form.style.display = 'none';
    };

    leftTitle.style.display = 'none';
    forms.forEach(hideForm);

};

const addNewSubjectOption = document.getElementById("add-new-subject-option");
addNewSubjectOption.addEventListener(
    'click',
    function showSubjectsForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = "Add New Subject";
        leftTitle.style.display = '';
        addNewSubjectForm.style.display = '';
    }
);

const viewAllSubjectsOption = document.getElementById("view-all-subjects-option");
viewAllSubjectsOption.addEventListener(
    'click',
    function showSubjectsForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = "All Subjects";
        leftTitle.style.display = '';
        viewAllSubjects.style.display = '';
    }
);

const behaviourParametersOption = document.getElementById("behaviour-parameters-option");
behaviourParametersOption.addEventListener(
    'click',
    function showBehaviorParametersForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = "Behaviour Parameters";
        leftTitle.style.display = '';
        behaviourParametersForm.style.display = '';
    }
);

const scoringOption = document.getElementById("scoring-option");
scoringOption.addEventListener(
    'click',
    function showScoringForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = "Scoring";
        leftTitle.style.display = '';
        scoringForm.style.display = '';
    }
);

const analysisOption = document.getElementById("analysis-option");
analysisOption.addEventListener(
    'click',
    function showAnalysisForm() {
        clearTitleAndHideForms();
        leftTitle.innerHTML = "Analysis";
        leftTitle.style.display = '';
        analysisForm.style.display = '';
    }
);

const addNewSubjectButton = document.querySelector('#add-new-subject-button');
addNewSubjectButton.addEventListener(
    'click',
    function addNewSubject() {
        const viewAllSubjectsBody = document.querySelector('#view-all-subjects-table-body');

        let fields = [
            '#subject-id-field',
            '#genotype-field',
            '#group-field',
            '#treatment-field',
            '#comment-field',];

        let tableCells = [];
        function createTableCellForField(fieldID) {
            // Get field element
            let field = document.querySelector(fieldID);
            // Get data from field
            let fieldValue = field.value;
            // Clear original field
            field.value = '';
            // create table cell
            let tableCell = document.createElement("td");
            // create data-label
            let temp = fieldID.split('-');
            let dataLabel = temp.slice(0, temp.length - 1).join('-');
            // set data-label attribute
            tableCell.setAttribute('data-label', dataLabel);
            // set inner value
            tableCell.innerText = fieldValue;
            // done
            tableCells.push(tableCell);
        };

        // Create the cells (they're appended to the tableCells array)
        fields.forEach(createTableCellForField);
        
        // Do dropdown
        let sexDropdown = $('#sex-value-dropdown');
        // Get data from form
        let sexValue = sexDropdown.dropdown('get value');
        // Create table cell
        let sexValueTableCell = document.createElement('td');
        let sexValueDataLabel = 'sex-value';
        sexValueTableCell.setAttribute('data-label', sexValueDataLabel);
        sexValueTableCell.innerText = sexValue;
        // Splice it into the table Cells
        tableCells.splice(2, 0, sexValueTableCell);

        // Create the table row
        let tableRow = document.createElement('tr');
        // Add all cells into the row
        function addToTableRow(tableCell) {
            tableRow.insertAdjacentHTML('beforeend',tableCell.outerHTML);
        };
        tableCells.forEach(addToTableRow);

        // Add the table row to the table
        viewAllSubjectsBody.insertAdjacentHTML('beforeend',tableRow.outerHTML);
    }
);

const addBehaviourParameterButton = document.getElementById("add-behaviour-parameter-button");
let rowCounter = 1;
addBehaviourParameterButton.addEventListener(
    'click',
    function addBehaviourParameterRow() {
        let behaviourParameterList = document.querySelector("#behaviour-parameter-list");
        let index = { text: ++rowCounter };
        behaviourParameterList.insertAdjacentHTML("beforeend",
            `
          <div id="behaviour-parameter-row-${index.text}">
            <div class="inline fields">
              <div class="four wide field">
                <label>${index.text}</label>
                <input type="text" placeholder="Key">
              </div>
              <div class="five wide field">
                <input type="text" placeholder="Behaviour">
              </div>
              <i class="close icon" id="behaviour-parameter-row-close-icon-${index.text}"></i>
          </div>
          `
        );
        let id = "behaviour-parameter-row-close-icon-".concat(rowCounter);
        let behaviourParameterRowCloseIcon = document.querySelector("#behaviour-parameter-row-close-icon-".concat(rowCounter));
        behaviourParameterRowCloseIcon.addEventListener(
            'click',
            function removeBehaviourParameterRow() {
                let behaviourParameterRow = behaviourParameterRowCloseIcon.parentElement;
                behaviourParameterRow.remove();
                rowCounter--;
            }
        )
    }
);