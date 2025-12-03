<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\Notification;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class NotificationController
{
    public function index(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $notifications = Notification::where('user_id', $user['id'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        $response->getBody()->write(json_encode(['success' => true, 'data' => $notifications]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function markAsRead(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $id = $args['id'];
        $notification = Notification::where('user_id', $user['id'])->find($id);

        if ($notification) {
            $notification->read_at = date('Y-m-d H:i:s');
            $notification->save();
        }

        $response->getBody()->write(json_encode(['success' => true]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function markAllAsRead(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        Notification::where('user_id', $user['id'])
            ->whereNull('read_at')
            ->update(['read_at' => date('Y-m-d H:i:s')]);

        $response->getBody()->write(json_encode(['success' => true]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deleteAll(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        Notification::where('user_id', $user['id'])->delete();

        $response->getBody()->write(json_encode(['success' => true]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
