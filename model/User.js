import RestEasy from './RestEasy.js';

export default class User {
    constructor (data) {
        if (data !== undefined) {
            this.password = data.password;
            this.displayName = data.displayName;
            this.id = data.id;
            this.friends = data.friends;
            this.username = data.username;
        }
    }

    static async all () {
        return User.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('User', id);

        return new User (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('User', undefined, query);

        let models = data.map (d => new User (d));

        return models;
    }

    async save () {
        const obj = {
            password : this.password,
            displayName : this.displayName,
            id : this.id,
            friends : this.friends,
            username : this.username,
        };

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('User', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('User', this.id, obj);
        }
    }

    async destroy () {
        return RestEasy.instance.destroy ('User', this.id);
    }
    

}

