<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\AuthService;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;

final class RedirectIfAuthenticatedMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $responseFactory;

    public function __construct(ResponseFactoryInterface $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (AuthService::user()) {
            $routeParser = RouteContext::fromRequest($request)->getRouteParser();
            $response = $this->responseFactory->createResponse();

            return $response
                ->withHeader('Location', $routeParser->urlFor('home'))
                ->withStatus(302);
        }

        return $handler->handle($request);
    }
}
