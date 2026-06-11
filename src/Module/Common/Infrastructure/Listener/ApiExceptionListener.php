<?php

declare(strict_types=1);

namespace App\Module\Common\Infrastructure\Listener;

use App\Module\Common\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;
use App\Module\Common\Domain\Exception\ResourceNotFoundException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Exception\TooManyLoginAttemptsAuthenticationException;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

final readonly class ApiExceptionListener implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%kernel.debug%')]
        private bool $debug,
    )
    {
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $e = $event->getThrowable();

        if ($e instanceof ValidationFailedException) {
            $context = [
                'exception' => $e::class,
                'file' => sprintf('%s:%d', $e->getFile(), $e->getLine()),
                'trace' => $e->getTrace(),          // массив фреймов
                'previous' => $this->previousChain($e), // цепочка вложенных исключений
            ];

            $response = [
                'code' => 422,
                'error_code' => ErrorCode::VALIDATION_ERROR->value,
                'message' => 'Validation failed',
                'errors' => $this->violationsToArray($e->getViolations()),
            ];

            if ($this->debug) {
                $response['context'] = $context;
            }

            $event->setResponse(new JsonResponse($response, 422));

            return;
        }


        [$status, $code, $message, $context] = match (true) {

            $e instanceof AbstractDomainException => [
                $e::getStatusCode(),
                $e::getDomainErrorCode(),
                $e->getMessage(),
                $e->getPublicContext(),
            ],

            $e instanceof ResourceNotFoundException => [
                $e::getStatusCode(),
                $e::getDomainErrorCode(),
                $e->getMessage(),
                []
            ],

            $e instanceof HttpExceptionInterface => [
                $e->getStatusCode(),
                $this->codeForStatus($e->getStatusCode()),
                $e->getMessage(),
                []
            ],

            default => [
                500,
                ErrorCode::INTERNAL_ERROR->value,
                $this->debug ? $e->getMessage() : 'Internal server error',
                [],
            ],
        };

        $error = ['code' => $status, 'error_code' => $code, 'message' => $message];


        if ($this->debug) {
            $error['context'] = $context;

            $error['context'][] = [
                'exception' => $e::class,
                'file' => sprintf('%s:%d', $e->getFile(), $e->getLine()),
                'trace' => $e->getTrace(),
                'previous' => $this->previousChain($e),
            ];
        }


        $event->setResponse(new JsonResponse(['error' => $error], $status));
    }

    private function codeForStatus(int $status): string
    {
        return match ($status) {
            400 => ErrorCode::BAD_REQUEST->value,
            429 => ErrorCode::HTTP_TO_MANY_REQUESTS->value,
            404 => ErrorCode::NOT_FOUND->value,
            405 => ErrorCode::METHOD_NOT_ALLOWED->value,
            422 => ErrorCode::VALIDATION_ERROR->value,
            default => ErrorCode::HTTP_ERROR->value,
        };
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onKernelException', 10]];
    }

    private function violationsToArray(ConstraintViolationListInterface $violations): array
    {
        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = [
                'field' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
            ];
        }

        return $errors;
    }

    private function previousChain(\Throwable $e): array
    {
        $chain = [];
        while ($e = $e->getPrevious()) {
            $chain[] = [
                'exception' => $e::class,
                'message' => $e->getMessage(),
                'file' => sprintf('%s:%d', $e->getFile(), $e->getLine()),
            ];
        }

        return $chain;
    }


}
