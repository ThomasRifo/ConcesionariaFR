<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'soap' => [
        'wsdl' => env('SOAP_WSDL', null),
        'location' => env('SOAP_LOCATION', null),
        'uri' => env('SOAP_URI', null),
        'options' => [
            'soap_version' => env('SOAP_VERSION', SOAP_1_2),
            'trace' => env('SOAP_TRACE', true),
            'exceptions' => env('SOAP_EXCEPTIONS', true),
            'cache_wsdl' => env('SOAP_CACHE_WSDL', WSDL_CACHE_NONE),
            'connection_timeout' => env('SOAP_CONNECTION_TIMEOUT', 30),
            'user_agent' => env('SOAP_USER_AGENT', 'Laravel SoapClient'),
        ],
        'auth' => [
            'username' => env('SOAP_USERNAME', null),
            'password' => env('SOAP_PASSWORD', null),
        ],
        'headers' => [],
    ],

    'autodev' => [
        'api_key' => env('AUTO_DEV_API_KEY'),
        'base_url' => env('AUTO_DEV_BASE_URL', 'https://api.auto.dev'),
    ],

];
