import RestEasy from './RestEasy.js';
import User from './User.js';

export default class Login {
    constructor (data) {
        if (data !== undefined) {
            this.password = data.password;
            this.id = data.id;
            this.user = data.user;
            this.token = data.token;
            this.username = data.username;
        }
    }

    static async all () {
        return Login.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('Login', id);

        return new Login (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('Login', undefined, query);

        let models = data.map (d => new Login (d));

        return models;
    }

    async save () {
        const obj = {
            password : this.password,
            id : this.id,
            user : await this.user !== null && await this.user !== undefined ? (await this.user).id : undefined,
            token : this.token,
            username : this.username,
        };

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('Login', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('Login', this.id, obj);
        }
    }

    async destroy () {
        return RestEasy.instance.destroy ('Login', this.id);
    }
    
    #user_id;
    #user_memo;

    get user () {
        return (async () => {
            if (this.#user_memo !== undefined) {
                return this.#user_memo;
            }
            else if (this.#user_id === undefined) {
                return undefined;
            }

            let id = this.#user_id;

            this.#user_memo = await User.byId (id);

            return this.#user_memo;
        }) ();
    }

    set user (value) {
        if (value === null || value === undefined) {
            this.#user_id = undefined;
            this.#user_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#user_id = value;
        }
        else {
            this.#user_id = value.id;
            this.#user_memo = value;
        }
    }
    

}

