import RestEasy from './RestEasy.js';
import User from './User.js';

export default class FriendRequest {
    constructor (data) {
        if (data !== undefined) {
            this.from = data.from;
            this.id = data.id;
            this.to = data.to;
        }
    }

    static async all () {
        return FriendRequest.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('FriendRequest', id);

        return new FriendRequest (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('FriendRequest', undefined, query);

        let models = data.map (d => new FriendRequest (d));

        return models;
    }

    async save () {
        const obj = {
            from : await this.from !== null && await this.from !== undefined ? (await this.from).id : undefined,
            id : this.id,
            to : await this.to !== null && await this.to !== undefined ? (await this.to).id : undefined,
        };

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('FriendRequest', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('FriendRequest', this.id, obj);
        }
    }

    async destroy () {
        return RestEasy.instance.destroy ('FriendRequest', this.id);
    }
    
    #from_id;
    #from_memo;

    get from () {
        return (async () => {
            if (this.#from_memo !== undefined) {
                return this.#from_memo;
            }
            else if (this.#from_id === undefined) {
                return undefined;
            }

            let id = this.#from_id;

            this.#from_memo = await User.byId (id);

            return this.#from_memo;
        }) ();
    }

    set from (value) {
        if (value === null || value === undefined) {
            this.#from_id = undefined;
            this.#from_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#from_id = value;
        }
        else {
            this.#from_id = value.id;
            this.#from_memo = value;
        }
    }
    
    #to_id;
    #to_memo;

    get to () {
        return (async () => {
            if (this.#to_memo !== undefined) {
                return this.#to_memo;
            }
            else if (this.#to_id === undefined) {
                return undefined;
            }

            let id = this.#to_id;

            this.#to_memo = await User.byId (id);

            return this.#to_memo;
        }) ();
    }

    set to (value) {
        if (value === null || value === undefined) {
            this.#to_id = undefined;
            this.#to_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#to_id = value;
        }
        else {
            this.#to_id = value.id;
            this.#to_memo = value;
        }
    }
    
    accept () {
        const obj = {
        };

        return RestEasy.instance.customMethod ('FriendRequest', this.id, obj);
    }

}

