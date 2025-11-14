import RestEasy from './RestEasy.js';
import User from './User.js';

export default class AbuseReport {
    constructor (data) {
        if (data !== undefined) {
            this.note = data.note;
            this.author = data.author;
            this.id = data.id;
            this.target = data.target;
        }
    }

    static async all () {
        return AbuseReport.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('AbuseReport', id);

        return new AbuseReport (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('AbuseReport', undefined, query);

        let models = data.map (d => new AbuseReport (d));

        return models;
    }

    async save () {
        const obj = {
            note : this.note,
            author : await this.author !== null && await this.author !== undefined ? (await this.author).id : undefined,
            id : this.id,
            target : await this.target !== null && await this.target !== undefined ? (await this.target).id : undefined,
        };

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('AbuseReport', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('AbuseReport', this.id, obj);
        }
    }

    async destroy () {
        return RestEasy.instance.destroy ('AbuseReport', this.id);
    }
        
    #author_id;
    #author_memo;

    get author () {
        return (async () => {
            if (this.#author_memo !== undefined) {
                return this.#author_memo;
            }
            else if (this.#author_id === undefined) {
                return undefined;
            }

            let id = this.#author_id;

            this.#author_memo = await User.byId (id);

            return this.#author_memo;
        }) ();
    }

    set author (value) {
        if (value === null || value === undefined) {
            this.#author_id = undefined;
            this.#author_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#author_id = value;
        }
        else {
            this.#author_id = value.id;
            this.#author_memo = value;
        }
    }
    
    #target_id;
    #target_memo;

    get target () {
        return (async () => {
            if (this.#target_memo !== undefined) {
                return this.#target_memo;
            }
            else if (this.#target_id === undefined) {
                return undefined;
            }

            let id = this.#target_id;

            this.#target_memo = await User.byId (id);

            return this.#target_memo;
        }) ();
    }

    set target (value) {
        if (value === null || value === undefined) {
            this.#target_id = undefined;
            this.#target_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#target_id = value;
        }
        else {
            this.#target_id = value.id;
            this.#target_memo = value;
        }
    }
    

}

