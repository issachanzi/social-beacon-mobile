<?php
    $schema_json = file_get_contents ('../../../schema.json');
    $schema = json_decode ($schema_json);

    foreach ($schema as $className => $classSchema) {
        $process = proc_open (
            ['php', 'model.php', $className],
            [['pipe', 'r'], ['file', "$className.js", 'w']],
            $pipes
        );

        fwrite ($pipes [0], json_encode ($classSchema));
        fclose ($pipes [0]);

        proc_close ($process);
    }
?>