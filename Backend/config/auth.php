<?php

return [
    'jwt_secret' => env('JWT_SECRET', 'please_change_me'),
    'jwt_ttl' => (int) env('JWT_TTL', 3600), // seconds
    'jwt_issuer' => env('JWT_ISSUER', 'cih-backend'),
];
