<?php
    $className = $argv [1];
    $schema_json = stream_get_contents (STDIN);
    $schema = json_decode ($schema_json);

    $associations = $schema->fields;

    $imports = array ();
    foreach ($associations as $ass) {
        if ($ass->isAssociation) {
            $imports [] = $ass->type;
        }
    }
    $imports = array_unique ($imports);
?>
import RestEasy from './RestEasy.js';
<?php foreach ($imports as $importClassName) { ?>
import <?php echo $importClassName; ?> from './<?php echo $importClassName; ?>.js';
<?php } ?>

export default class <?php echo $className; ?> {
    constructor (data) {
        if (data !== undefined) {
<?php
            foreach ($associations as $ass) {?>
<?php if ($ass->type == 'date' || $ass->type == 'time' || $ass->type == 'datetime-local') { ?>
            if (data.<?php echo $ass->name; ?> !== undefined) {
                this.<?php echo $ass->name; ?> = new Date ();
                this.<?php echo $ass->name; ?>.setTime (data.<?php echo $ass->name; ?>);
            }
<?php } else { ?>
            this.<?php echo $ass->name; ?> = data.<?php echo $ass->name ?>;
<?php } ?>
<?php } ?>
<?php           /* Object.keys (data).forEach (k => {
                this [k] = data [k];
            }); */ ?>
        }
    }

    static async all () {
        return <?php echo $className; ?>.where (undefined);
    }

    static async byId (id) {
        let data = await RestEasy.instance.get ('<?php echo $className; ?>', id);

        return new <?php echo $className; ?> (data);
    }

    static async where (query) {
        let data = await RestEasy.instance.get ('<?php echo $className; ?>', undefined, query);

        let models = data.map (d => new <?php echo $className; ?> (d));

        return models;
    }

    async save () {
        const obj = await this.toObject ();

        if (this.id === undefined) {
            const response = await RestEasy.instance.post ('<?php echo $className; ?>', obj);

            Object.keys(response).forEach (k => {
                this [k] = response [k];
            });
        }
        else {
            await RestEasy.instance.put ('<?php echo $className; ?>', this.id, obj);
        }
    }

    async toObject () {
        const obj = {
<?php
                foreach ($associations as $ass) {
                    if ($ass->isAssociation) {
?>
            <?php echo $ass->name; ?> : await this.<?php echo $ass->name; ?> !== null && await this.<?php echo $ass->name; ?> !== undefined ? (await this.<?php echo $ass->name; ?>).id : undefined,
<?php
                    }
                    else if ($ass->type == 'date' || $ass->type == 'time' || $ass->type == 'datetime-local'){ ?>
            <?php echo $ass->name; ?> : this.<?php echo $ass->name; ?> !== undefined && this.<?php echo $ass->name; ?> !== null ? this.<?php echo $ass->name; ?>.getTime () : undefined,
<?php
                    }
                    else { ?>
            <?php echo $ass->name; ?> : this.<?php echo $ass->name; ?>,
<?php
                    }
                }
            ?>
        };

        return obj;
    }

    async destroy () {
        return RestEasy.instance.destroy ('<?php echo $className ?>', this.id);
    }
    <?php
        foreach ($associations as $ass) {
            if ($ass->type == 'date' || $ass->type == 'time' || $ass->type == 'datetime-local'){ ?>

    #<?php echo $ass->name ?>;

    set <?php echo $ass->name ?> (value) {
        if (value.getTime !== undefined) {
            this.#<?php echo $ass->name ?> = value;
        }
        else {
            this.#<?php echo $ass->name ?> = new Date ();
            this.#<?php echo $ass->name ?>.setTime (value);
        }
    }

    get <?php echo $ass->name ?> () {
        return this.#<?php echo $ass->name ?>;
    }
        <?php
            }
        }
    ?>
    <?php
        foreach ($associations as $ass) {
            if ($ass->isAssociation) {
                $name = $ass->name;
                $type = $ass->type;
    ?>

    #<?php echo $name; ?>_id;
    #<?php echo $name; ?>_memo;

    get <?php echo $name; ?> () {
        return (async () => {
            if (this.#<?php echo $name; ?>_memo !== undefined) {
                return this.#<?php echo $name; ?>_memo;
            }
            else if (this.#<?php echo $name; ?>_id === undefined) {
                return undefined;
            }

            let id = this.#<?php echo $name ?>_id;

            this.#<?php echo $name; ?>_memo = await <?php echo $type ?>.byId (id);

            return this.#<?php echo $name; ?>_memo;
        }) ();
    }

    set <?php echo $name; ?> (value) {
        if (value === null || value === undefined) {
            this.#<?php echo $name ?>_id = undefined;
            this.#<?php echo $name ?>_memo = undefined;
        }
        else if (value.id === undefined) {
            this.#<?php echo $name ?>_id = value;
        }
        else {
            this.#<?php echo $name ?>_id = value.id;
            this.#<?php echo $name ?>_memo = value;
        }
    }
    <?php
            }
        }
    ?>

<?php foreach ($schema->methods as $methodName => $params) { ?>
<?php $paramsString = implode (",\n        ", array_keys (get_object_vars ($params))); ?>
    <?php echo $methodName; ?> (<?php echo $paramsString; ?>) {
        const obj = {
<?php
                foreach ($params as $param) {
                    if ($param->isAssociation) {
?>
            <?php echo $param->name; ?> : <?php echo $param->name; ?> !== null && <?php echo $param->name; ?> !== undefined ? this.<?php echo $param->name; ?>.id : undefined,
<?php
                    }
                    else if ($param->isDate) { ?>
            <?php echo $param->name; ?> : <?php echo $param->name; ?> !== undefined && <?php echo $param->name; ?> !== null ? <?php echo $param->name; ?>.getTime () : undefined,
<?php
                    }
                    else { ?>
            <?php echo $param->name; ?> : <?php echo $param->name; ?>,
<?php
                    }
                }
            ?>
        };

        return RestEasy.instance.customMethod ('<?php echo $className; ?>', this.id, '<?php echo $methodName ?>', obj);
    }
<?php } ?>

}

