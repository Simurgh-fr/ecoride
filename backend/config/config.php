

<?php
// Fichier de configuration compatible local (.env) et Heroku (Config Vars)

function get_env_var($key, $default = null) {
    // Priorité : variable d’environnement (Heroku) > fichier .env local
    $value = getenv($key);
    if ($value !== false) {
        return $value;
    }

    // Lecture du fichier .env local si disponible
    $envPath = __DIR__ . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            [$envKey, $envValue] = explode('=', $line, 2);
            if (trim($envKey) === $key) {
                return trim($envValue);
            }
        }
    }

    return $default;
}

// Définition des constantes de configuration
define('DB_HOST', get_env_var('DB_HOST', 'localhost'));
define('DB_NAME', get_env_var('DB_NAME', 'ecoride'));
define('DB_USER', get_env_var('DB_USER', 'root'));
define('DB_PASSWORD', get_env_var('DB_PASSWORD', 'eCoRide$2025!sql'));
define('MONGO_URI', get_env_var('MONGO_URI', 'mongodb://192.168.1.112:27017'));