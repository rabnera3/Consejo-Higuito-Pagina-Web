<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use Illuminate\Database\Capsule\Manager as DB;
use App\Models\Notification;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Exception;

class BlogController
{

    /**
     * Helper para retornar respuestas JSON
     */
    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withStatus($status)
            ->withHeader('Content-Type', 'application/json');
    }

    /**
     * GET /api/blog - Listar posts del blog (públicos y privados según autenticación)
     */
    public function index(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $queryParams = $request->getQueryParams();
            $status = $queryParams['status'] ?? 'published';

            $query = DB::table('blog_posts as bp')
                ->leftJoin('employees as e', 'bp.author_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select('bp.*', 'e.full_name as author_name', 'd.name as department_name');

            // Si no hay usuario autenticado, solo mostrar publicados
            if (!$user) {
                $query->where('bp.status', 'published');
            } elseif ($status !== 'all') {
                $query->where('bp.status', $status);
            }

            // Si es modo gestión (status=all) y no es admin/gerente, filtrar por departamento
            if ($user && $status === 'all') {
                $allowedRoles = ['admin', 'gerente'];
                if (!in_array($user['role'] ?? '', $allowedRoles)) {
                    $query->where('bp.department_id', $user['department_id']);
                }
            }

            $posts = $query->orderByDesc('bp.published_at')
                ->orderByDesc('bp.created_at')
                ->get();

            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $posts
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al obtener posts: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/blog/:id - Obtener un post específico
     */
    public function show(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];
            $user = $request->getAttribute('user');

            $query = DB::table('blog_posts as bp')
                ->leftJoin('employees as e', 'bp.author_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select(
                    'bp.*',
                    'e.full_name as author_name',
                    'e.email as author_email',
                    'd.name as department_name'
                )
                ->where('bp.id', $id);

            // Si no hay usuario, solo permitir ver publicados
            if (!$user) {
                $query->where('bp.status', 'published');
            }

            $post = $query->first();

            if (!$post) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Post no encontrado'
                ], 404);
            }

            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $post
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al obtener post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/blog/slug/:slug - Obtener un post por slug
     */
    public function showBySlug(Request $request, Response $response, array $args): Response
    {
        try {
            $slug = $args['slug'];
            $user = $request->getAttribute('user');

            $query = DB::table('blog_posts as bp')
                ->leftJoin('employees as e', 'bp.author_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select(
                    'bp.*',
                    'e.full_name as author_name',
                    'e.email as author_email',
                    'd.name as department_name'
                )
                ->where('bp.slug', $slug);

            if (!$user) {
                $query->where('bp.status', 'published');
            }

            $post = $query->first();

            if (!$post) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Post no encontrado'
                ], 404);
            }

            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $post
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al obtener post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/blog - Crear un nuevo post
     */
    public function create(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');

            if (!$user) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No autenticado'
                ], 401);
            }

            // Verificar permisos: admin, gerente o jefe
            $allowedRoles = ['admin', 'gerente', 'jefe'];
            if (!in_array($user['role'] ?? '', $allowedRoles)) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para crear posts'
                ], 403);
            }

            $data = $request->getParsedBody();

            // Validar campos requeridos
            if (empty($data['title']) || empty($data['body'])) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'El título y el contenido son obligatorios'
                ], 400);
            }

            // Generar slug único automáticamente
            $baseSlug = !empty($data['slug']) ? $data['slug'] : $this->generateSlug($data['title']);
            $finalSlug = $this->ensureUniqueSlug($baseSlug);

            // Lógica de estado y departamento según rol
            $role = $user['role'] ?? '';
            $isAdminOrManager = in_array($role, ['admin', 'gerente']);

            if ($isAdminOrManager) {
                // Admin/Gerente pueden elegir estado y departamento
                $status = $data['status'] ?? 'draft';
                $department_id = !empty($data['department_id']) ? $data['department_id'] : $user['department_id'];
            } else {
                // Jefe: Forzado a borrador y su propio departamento
                $status = 'draft';
                $department_id = $user['department_id'];
            }

            $published_at = ($status === 'published') ? date('Y-m-d H:i:s') : null;

            $postId = DB::table('blog_posts')->insertGetId([
                'title' => $data['title'],
                'slug' => $finalSlug,
                'excerpt' => $data['excerpt'] ?? null,
                'body' => $data['body'] ?? '',
                'cover_image' => $data['cover_image'] ?? null,
                'video_url' => $data['video_url'] ?? null,
                'category' => $data['category'] ?? null,
                'tags' => $data['tags'] ?? null,
                'author_id' => $user['id'],
                'department_id' => $department_id,
                'status' => $status,
                'published_at' => $published_at,
                'published_date' => $data['published_date'] ?? null,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Post creado exitosamente',
                'data' => ['id' => $postId, 'slug' => $finalSlug]
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al crear post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/blog/:id - Actualizar un post
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $user = $request->getAttribute('user');
            $id = $args['id'];

            if (!$user) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No autenticado'
                ], 401);
            }

            // Verificar permisos: admin, gerente o jefe
            $allowedRoles = ['admin', 'gerente', 'jefe'];
            if (!in_array($user['role'] ?? '', $allowedRoles)) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para actualizar posts'
                ], 403);
            }

            $data = $request->getParsedBody();

            // Verificar que el post existe
            $post = DB::table('blog_posts')->where('id', $id)->first();

            if (!$post) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Post no encontrado'
                ], 404);
            }

            $role = $user['role'] ?? '';
            $isAdminOrManager = in_array($role, ['admin', 'gerente']);

            // Admin y gerente pueden editar cualquier post
            // Jefe solo puede editar sus propios posts
            if (!$isAdminOrManager && $post->author_id != $user['id']) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para editar este post'
                ], 403);
            }

            // Si cambia el slug, verificar que sea único
            if (!empty($data['slug']) && $data['slug'] !== $post->slug) {
                $slugExists = DB::table('blog_posts')
                    ->where('slug', $data['slug'])
                    ->where('id', '!=', $id)
                    ->exists();

                if ($slugExists) {
                    return $this->jsonResponse($response, [
                        'success' => false,
                        'message' => 'El slug ya existe'
                    ], 400);
                }
            }

            $updateData = [
                'updated_at' => date('Y-m-d H:i:s')
            ];

            if (!empty($data['title']))
                $updateData['title'] = $data['title'];
            if (!empty($data['slug']))
                $updateData['slug'] = $data['slug'];
            if (isset($data['excerpt']))
                $updateData['excerpt'] = $data['excerpt'];
            if (!empty($data['body']))
                $updateData['body'] = $data['body'];
            if (isset($data['cover_image']))
                $updateData['cover_image'] = $data['cover_image'];
            if (isset($data['video_url']))
                $updateData['video_url'] = $data['video_url'];
            if (isset($data['category']))
                $updateData['category'] = $data['category'];
            if (isset($data['tags']))
                $updateData['tags'] = $data['tags'];
            if (isset($data['published_date']))
                $updateData['published_date'] = $data['published_date'];

            if ($isAdminOrManager) {
                // Admin/Gerente pueden cambiar estado y departamento
                if (!empty($data['status'])) {
                    $updateData['status'] = $data['status'];
                    if ($data['status'] === 'published' && !$post->published_at) {
                        $updateData['published_at'] = date('Y-m-d H:i:s');
                    }
                }
                if (!empty($data['department_id'])) {
                    $updateData['department_id'] = $data['department_id'];
                }
            } else {
                // Jefe: Forzado a borrador si intenta cambiarlo a published (o mantenerlo draft)
                // No puede cambiar departamento
                $updateData['status'] = 'draft';
            }

            DB::table('blog_posts')->where('id', $id)->update($updateData);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Post actualizado exitosamente'
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al actualizar post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/blog/:id - Eliminar un post
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $user = $request->getAttribute('user');
            $id = $args['id'];

            if (!$user) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No autenticado'
                ], 401);
            }

            $allowedRoles = ['admin', 'gerente'];
            if (!in_array($user['role'] ?? '', $allowedRoles)) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para eliminar posts'
                ], 403);
            }

            // Verificar que el post existe
            $post = DB::table('blog_posts')->where('id', $id)->first();

            if (!$post) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Post no encontrado'
                ], 404);
            }

            // Admin y gerente pueden eliminar cualquier post, otros roles solo los suyos
            $canDeleteAnyPost = in_array($user['role'] ?? '', ['admin', 'gerente']);
            if (!$canDeleteAnyPost && $post->author_id != $user['id']) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para eliminar este post'
                ], 403);
            }

            DB::table('blog_posts')->where('id', $id)->delete();

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Post eliminado exitosamente'
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al eliminar post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/blog/upload - Subir imagen para el blog
     */
    public function uploadImage(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');

            if (!$user || !in_array($user['role'], ['admin', 'gerente', 'jefe'])) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para subir imágenes'
                ], 403);
            }

            $uploadedFiles = $request->getUploadedFiles();

            if (empty($uploadedFiles['image'])) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No se proporcionó ninguna imagen'
                ], 400);
            }

            $uploadedFile = $uploadedFiles['image'];

            if ($uploadedFile->getError() !== UPLOAD_ERR_OK) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Error al subir la imagen'
                ], 400);
            }

            // Validar tipo de archivo
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $fileType = $uploadedFile->getClientMediaType();

            if (!in_array($fileType, $allowedTypes)) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Tipo de archivo no permitido'
                ], 400);
            }

            // Crear directorio si no existe
            $uploadDir = __DIR__ . '/../../../public/uploads/blog';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Generar nombre único
            $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
            $filename = uniqid('blog_') . '.' . $extension;
            $filepath = $uploadDir . '/' . $filename;

            // Mover archivo
            $uploadedFile->moveTo($filepath);

            $imageUrl = '/uploads/blog/' . $filename;

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Imagen subida exitosamente',
                'data' => ['url' => $imageUrl]
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al subir imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generateSlug(string $title): string
    {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');

        return substr($slug, 0, 160);
    }

    private function ensureUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $originalSlug = $slug;
        $count = 1;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    private function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = DB::table('blog_posts')->where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
    /**
     * POST /api/blog/{id}/request-changes
     */
    public function requestChanges(Request $request, Response $response, array $args): Response
    {
        try {
            $user = $request->getAttribute('user');
            $id = $args['id'];
            $data = $request->getParsedBody();
            $reason = $data['reason'] ?? '';

            if (!$user || !in_array($user['role'], ['admin', 'gerente'])) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'No tienes permisos para solicitar cambios'
                ], 403);
            }

            if (empty($reason)) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Debes proporcionar un motivo'
                ], 400);
            }

            $post = DB::table('blog_posts')->where('id', $id)->first();
            if (!$post) {
                return $this->jsonResponse($response, [
                    'success' => false,
                    'message' => 'Post no encontrado'
                ], 404);
            }

            // Create notification
            Notification::create([
                'user_id' => $post->author_id,
                'type' => 'blog_changes_requested',
                'title' => 'Cambios solicitados en tu blog',
                'message' => "Se han solicitado cambios en tu post '{$post->title}'. Motivo: {$reason}",
                'data' => ['post_id' => $id, 'reason' => $reason]
            ]);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Solicitud de cambios enviada exitosamente'
            ]);

        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'message' => 'Error al solicitar cambios: ' . $e->getMessage()
            ], 500);
        }
    }
}
