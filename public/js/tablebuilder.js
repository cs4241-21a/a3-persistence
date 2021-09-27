/**
 * 
 * @param {Element} table The <table> tag to add the data to (will be emptied)
 * @param {*} columns A map from the keys in the data to the column header
 * @param {*} data An array of objects containing keys and the data for that key
 */
function buildTable(table, columns, data) {

    const tableHeader = makeTableHeader(columns);
    table.appendChild(tableHeader);

    const tableBody = makeTableBody(columns, data);
    table.appendChild(tableBody);
}

function makeTableHeader(columns) {
    let tableHead = document.createElement('thead');
    let tableHeadRow = document.createElement('tr');

    Object.keys(columns).forEach(columnKey => {
        const columnEntry = columns[columnKey];
        let columnName = "";
        if (isString(columnEntry)) {
            columnName = columnEntry;
        } else {
            columnName = columnEntry.name;
        }
        let th = document.createElement('th');
        th.innerText = columnName;
        th.scope = "col";
        tableHeadRow.appendChild(th);
    });

    tableHead.appendChild(tableHeadRow);

    return tableHead;
}

function makeTableBody(columns, data) {
    let tableBody = document.createElement('tbody');

    data.forEach(rowData => {
        const tableRow = makeTableRow(columns, rowData);
        tableBody.appendChild(tableRow);
    });

    return tableBody;
}

function makeTableRow(columns, rowData) {
    let tableRow = document.createElement('tr');

    Object.keys(columns).forEach(columnKey => {
        const columnData = columns[columnKey];
        let columnValue = rowData[columnKey];
        if (columnData.formatter) {
            columnValue = columnData.formatter(columnValue);
        }


        let td = document.createElement(columnData.isHeader ? 'th' : 'td');
        if (columnData.contentCallback) {
            td.innerHTML = columnData.contentCallback(rowData);
        } else {
            td.innerText = columnData.text || columnValue;
            td.scope = columnData.isHeader ? 'row' : null;
            td.className = columnData.className;
        }

        tableRow.appendChild(td);
    });

    return tableRow;
}

const isString = (val) => (typeof val === 'string' || val instanceof String);