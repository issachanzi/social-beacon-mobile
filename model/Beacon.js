import RestEasy from './RestEasy.js';
import User from './User.js';

export default class Beacon {
    constructor (data) {
        if (data !== undefined) {
            this.sender = data.sender;
            this.id = data.id;
            if (data.timestamp !== undefined) {
                this.timestamp = new Date ();
                this.timestamp.setTime (data.timestamp);
            }
        }
    }

    static async all () {
        return Beacon.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('Beacon', id);

        return new Beacon (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('Beacon', undefined, query);

        let models = data.map (d => new Beacon (d));

        return models;
    }

    async save () {
        const obj = await this.toObject ();

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('Beacon', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('Beacon', this.id, obj);
        }
    }

    async toObject () {
        const obj = {
            sender : await this.sender !== null && await this.sender !== undefined ? (await this.sender).id : undefined,
            id : this.id,
            timestamp : this.timestamp !== undefined && this.timestamp !== null ? this.timestamp.getTime () : undefined,
        };

        return obj;
    }

    async destroy () {
        return RestEasy.instance.destroy ('Beacon', this.id);
    }
    
    #timestamp;

    set timestamp (value) {
        if (value.getTime !== undefined) {
            this.#timestamp = value;
        }
        else {
            this.#timestamp = new Date ();
            this.#timestamp.setTime (value);
        }
    }

    get timestamp () {
        return this.#timestamp;
    }
            
    #sender_id;
    #sender_memo;

    get sender () {
        return (async () => {
            if (this.#sender_memo !== undefined) {
                return this.#sender_memo;
            }
            else if (this.#sender_id === undefined) {
                return undefined;
            }

            let id = this.#sender_id;

            this.#sender_memo = await User.byId (id);

            return this.#sender_memo;
        }) ();
    }

    set sender (value) {
        if (value === null || value === undefined) {
            this.#sender_id = undefined;
            this.#sender_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#sender_id = value;
        }
        else {
            this.#sender_id = value.id;
            this.#sender_memo = value;
        }
    }
    

}

