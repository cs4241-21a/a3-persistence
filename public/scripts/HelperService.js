class HelperService {
    static renderTemplate = (template, id, data) => {
        document.getElementById(id).innerHTML = Mustache.render(template, {data});
    }

    static getTimeString = (submitted) => {
        const now = luxon.DateTime.now().toSeconds();
        submitted = luxon.DateTime.fromISO(submitted).toSeconds();
        const seconds = now - submitted;
        if (seconds < 1) {
            return `Just now`;
        } else if (seconds < 60) {
            return `${Math.floor(seconds)} seconds ago`;
        } else if (seconds < 60 * 60) {
            return `${Math.floor(seconds / 60)} minutes ago`;
        } else if (seconds < 24 * 60 * 60) {
            return `${Math.floor(seconds / 60 / 60)} hours ago`;
        } else if (seconds < 7 * 24 * 60 * 60) {
            return `${Math.floor(seconds / 24 / 60 / 60)} days ago`;
        } else if (seconds < 28 * 24 * 60 * 60) {
            return `${Math.floor(seconds / 7 / 24 / 60 / 60)} weeks ago`;
        } else if (seconds < 365 * 24 * 60 * 60) {
            return `${Math.floor(seconds / 30 / 24 / 60 / 60)} months ago`;
        } else {
            return `${Math.floor(seconds / 365 / 24 / 60 / 60)} years ago`;
        }
    }
}
