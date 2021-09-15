/**
 * Calculates a deadline date based on a creation date and task priority.
 * @param {String} dateCreated Date string of task creation data in MM/DD/YYYY format
 * @param {Int} priority Priority of task [0, 10]
 * @returns A deadline date string in the form MM/DD/YYYY.
 */
 const createDeadline = (dateCreated, priority) => {

    let month = parseInt(dateCreated.substr(0, 2));
    let day = parseInt(dateCreated.substr(3, 2));
    let year = parseInt(dateCreated.substr(6, 4));
    let deadLine = new Date();
    deadLine.setDate(day);
    deadLine.setMonth(month - 1);
    deadLine.setFullYear(year);
  
    switch (priority) {
      case 0:
        deadLine.setFullYear(deadLine.getFullYear() + 1);
        break;
      case 1:
        deadLine.setMonth(deadLine.getMonth() + 6);
        break;
      case 2:
        deadLine.setMonth(deadLine.getMonth() + 3);
        break;
      case 3:
        deadLine.setMonth(deadLine.getMonth() + 2);
        break;
      case 4:
        deadLine.setMonth(deadLine.getMonth() + 1);
        break;
      case 5:
        deadLine.setDate(deadLine.getDate() + 15);
        break;
      case 6:
        deadLine.setDate(deadLine.getDate() + 7);
        break;
      case 7:
        deadLine.setDate(deadLine.getDate() + 3);
        break;
      case 8:
        deadLine.setDate(deadLine.getDate() + 2);
        break;
      case 9:
        deadLine.setDate(deadLine.getDate() + 1);
        break;
      case 10:
        // deadline is today no change
        break;
    }
  
    return `${String(deadLine.getMonth() + 1).padStart(2, '0')}/` +
      `${String(deadLine.getDate()).padStart(2, '0')}/${deadLine.getFullYear()}`;
  }

  module.exports.createDeadline = createDeadline;