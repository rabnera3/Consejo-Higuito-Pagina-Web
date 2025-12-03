<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\VisitReport;
use App\Models\VisitReportPhoto;
use App\Models\FieldLog;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FieldController
{
    // ============ VISIT REPORTS ============

    public function listVisitReports(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        $reports = VisitReport::with(['employee', 'photos'])
            ->where('employee_id', $employeeId)
            ->orderBy('visit_date', 'desc')
            ->get();

        $response->getBody()->write(json_encode(['success' => true, 'data' => $reports]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createVisitReport(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        if (!$employeeId) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Usuario no asociado a un empleado']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();

        try {
            $report = VisitReport::create([
                'employee_id' => $employeeId,
                'project_name' => $data['project_name'] ?? null,
                'location' => $data['location'],
                'visit_date' => $data['visit_date'],
                'objectives' => $data['objectives'],
                'findings' => $data['findings'],
                'agreements' => $data['agreements'] ?? null,
            ]);

            // Handle photo URLs if provided
            if (!empty($data['photos']) && is_array($data['photos'])) {
                foreach ($data['photos'] as $photo) {
                    VisitReportPhoto::create([
                        'visit_report_id' => $report->id,
                        'photo_url' => $photo['url'],
                        'caption' => $photo['caption'] ?? null,
                    ]);
                }
            }

            $report->load('photos');

            $response->getBody()->write(json_encode(['success' => true, 'data' => $report]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getVisitReport(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        try {
            $report = VisitReport::with('photos')
                ->where('id', $id)
                ->where('employee_id', $employeeId)
                ->first();

            if (!$report) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Reporte no encontrado']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode(['success' => true, 'data' => $report]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function updateVisitReport(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        try {
            $report = VisitReport::where('id', $id)->where('employee_id', $employeeId)->first();

            if (!$report) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Reporte no encontrado']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $data = $request->getParsedBody();

            $report->update([
                'project_name' => $data['project_name'] ?? null,
                'location' => $data['location'],
                'visit_date' => $data['visit_date'],
                'objectives' => $data['objectives'],
                'findings' => $data['findings'],
                'agreements' => $data['agreements'] ?? null,
            ]);

            // Update photos if provided (delete old ones and add new)
            if (isset($data['photos']) && is_array($data['photos'])) {
                // Delete old photos
                VisitReportPhoto::where('visit_report_id', $report->id)->delete();

                // Add new photos
                foreach ($data['photos'] as $photo) {
                    VisitReportPhoto::create([
                        'visit_report_id' => $report->id,
                        'photo_url' => $photo['url'],
                        'caption' => $photo['caption'] ?? null,
                    ]);
                }
            }

            $report->load('photos');

            $response->getBody()->write(json_encode(['success' => true, 'data' => $report]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function uploadVisitPhoto(Request $request, Response $response): Response
    {
        $uploadedFiles = $request->getUploadedFiles();

        if (!isset($uploadedFiles['photo'])) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se recibió ninguna foto']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $photo = $uploadedFiles['photo'];

        if ($photo->getError() !== UPLOAD_ERR_OK) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Error al subir la foto']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $extension = pathinfo($photo->getClientFilename(), PATHINFO_EXTENSION);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array(strtolower($extension), $allowedExtensions)) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Formato de imagen no permitido']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $filename = uniqid('visit_') . '.' . $extension;
        $uploadPath = __DIR__ . '/../../../public/uploads/visit_photos';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        try {
            $photo->moveTo($uploadPath . '/' . $filename);
            $url = '/uploads/visit_photos/' . $filename;

            $response->getBody()->write(json_encode(['success' => true, 'url' => $url]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function deleteVisitReport(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        try {
            $report = VisitReport::where('id', $id)->where('employee_id', $employeeId)->first();

            if (!$report) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Reporte no encontrado']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $report->delete();

            $response->getBody()->write(json_encode(['success' => true, 'message' => 'Reporte eliminado']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    // ============ FIELD LOGS ============

    public function listFieldLogs(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        $logs = FieldLog::with('employee')
            ->where('employee_id', $employeeId)
            ->orderBy('log_date', 'desc')
            ->get();

        $response->getBody()->write(json_encode(['success' => true, 'data' => $logs]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createFieldLog(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        if (!$employeeId) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Usuario no asociado a un empleado']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();

        try {
            $log = FieldLog::create([
                'employee_id' => $employeeId,
                'project_name' => $data['project_name'] ?? null,
                'log_date' => $data['log_date'],
                'activity_description' => $data['activity_description'],
                'observations' => $data['observations'] ?? null,
                'weather_conditions' => $data['weather_conditions'] ?? null,
            ]);

            $response->getBody()->write(json_encode(['success' => true, 'data' => $log]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function deleteFieldLog(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $user = $request->getAttribute('user');
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        try {
            $log = FieldLog::where('id', $id)->where('employee_id', $employeeId)->first();

            if (!$log) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Bitácora no encontrada']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $log->delete();

            $response->getBody()->write(json_encode(['success' => true, 'message' => 'Bitácora eliminada']));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
