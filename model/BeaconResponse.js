import RestEasy from './RestEasy.js';
import Beacon from './Beacon.js';
import User from './User.js';

export default class BeaconResponse {
    constructor (data) {
        if (data !== undefined) {
            this.beacon = data.beacon;
            this.id = data.id;
            this.user = data.user;
        }
    }

    static async all () {
        return BeaconResponse.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('BeaconResponse', id);

        return new BeaconResponse (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('BeaconResponse', undefined, query);

        let models = data.map (d => new BeaconResponse (d));

        return models;
    }

    async save () {
        const obj = await this.toObject ();

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('BeaconResponse', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('BeaconResponse', this.id, obj);
        }
    }

    async toObject () {
        const obj = {
            beacon : await this.beacon !== null && await this.beacon !== undefined ? (await this.beacon).id : undefined,
            id : this.id,
            user : await this.user !== null && await this.user !== undefined ? (await this.user).id : undefined,
        };

        return obj;
    }

    async destroy () {
        return RestEasy.instance.destroy ('BeaconResponse', this.id);
    }
        
    #beacon_id;
    #beacon_memo;

    get beacon () {
        return (async () => {
            if (this.#beacon_memo !== undefined) {
                return this.#beacon_memo;
            }
            else if (this.#beacon_id === undefined) {
                return undefined;
            }

            let id = this.#beacon_id;

            this.#beacon_memo = await Beacon.byId (id);

            return this.#beacon_memo;
        }) ();
    }

    set beacon (value) {
        if (value === null || value === undefined) {
            this.#beacon_id = undefined;
            this.#beacon_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#beacon_id = value;
        }
        else {
            this.#beacon_id = value.id;
            this.#beacon_memo = value;
        }
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

