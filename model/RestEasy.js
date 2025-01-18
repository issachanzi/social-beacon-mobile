export default class RestEasy {
    constructor (apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.authorization = null;

        if(! apiBaseUrl.endsWith ('/')) {
            this.apiBaseUrl += '/';
        }
    }

    static init (apiBaseUrl) {
        if (!RestEasy.instance) {
            RestEasy.instance = new RestEasy(apiBaseUrl);
        }
    }

    async get (modelName, id, query) {
        let url = this.apiBaseUrl + modelName;
        const queryString = new URLSearchParams (query).toString();
        if (id !== undefined) {
            url += '/' + id;
        }
        if (query !== undefined) {
            url += '?' + queryString;
        }

        return this.sendRequest (url, 'GET');
    }

    async post (modelName, body) {
        let url = this.apiBaseUrl + modelName;

        return this.sendRequest (url, 'POST', body);
    }

    async put (modelName, id, body) {
        let url = this.apiBaseUrl + modelName + '/' + id;

        return this.sendRequest (url, 'PUT', body);
    }

    async destroy (modelName, id) {
        let url = this.apiBaseUrl + modelName + '/' + id;

        return this.sendRequest (url, 'DELETE');
    }

    async customMethod (modelName, id, methodName, body) {
        let url = this.apiBaseUrl + modelName + '/' + id + '/' + methodName;

        return this.sendRequest (url, 'POST', body);
    }

    async sendRequest (url, method, body) {
        let headers = {
            Authorization : this.authorization
        };
        let options = {
            method: method,
            headers: headers
        };

        if (body != undefined) {
            options.body = JSON.stringify (body);
        }

        let response = await fetch(url, options);

        if (response.ok) {
            return response.json();
        }
        else {
            throw response.status;
        }
    }
}

