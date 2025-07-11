<?php
/**
 * Formulario de Contacto - Camilu Peluquería
 * 
 * Procesa los mensajes del formulario de contacto y envía notificaciones por email.
 * Compatible con Hostinger y la mayoría de hostings compartidos.
 * 
 * @author Lucas Ochoa
 * @version 1.0
 */

// Configuración de errores (desactivar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Cambiar a 0 en producción

// Headers de seguridad y CORS
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configuración del sitio
define('SITE_NAME', 'Camilu Peluquería');
define('SITE_EMAIL', 'contacto@camilupeluqueria.com'); // Cambiar por el email real
define('ADMIN_EMAIL', 'ochoalucas37@gmail.com');   // Email donde llegan los mensajes
define('SITE_URL', 'https://camilupeluqueria.com');    // URL del sitio

// Configuración de rate limiting (prevenir spam)
define('MAX_REQUESTS_PER_HOUR', 5);
define('RATE_LIMIT_FILE', __DIR__ . '/rate_limit.json');

/**
 * Función principal para procesar el formulario
 */
function processContactForm() {
    try {
        // Verificar método HTTP
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido', 405);
        }
        
        // Verificar rate limiting
        if (!checkRateLimit()) {
            throw new Exception('Demasiados intentos. Por favor, esperá un momento antes de enviar otro mensaje.', 429);
        }
        
        // Obtener y validar datos
        $data = validateFormData();
        
        // Verificar CAPTCHA básico (honeypot)
        if (!empty($_POST['website'])) {
            // Campo honeypot completado = bot
            throw new Exception('Solicitud inválida', 400);
        }
        
        // Sanitizar datos
        $data = sanitizeData($data);
        
        // Guardar en base de datos o archivo (opcional)
        saveContactData($data);
        
        // Enviar emails
        $emailSent = sendNotificationEmails($data);
        
        if (!$emailSent) {
            throw new Exception('Error al enviar el email. Tu mensaje fue guardado y te contactaremos pronto.', 500);
        }
        
        // Actualizar rate limiting
        updateRateLimit();
        
        // Respuesta exitosa
        sendJsonResponse(true, '¡Mensaje enviado correctamente! Te contactaremos dentro de las próximas 24 horas.');
        
    } catch (Exception $e) {
        error_log("Error en formulario de contacto: " . $e->getMessage());
        sendJsonResponse(false, $e->getMessage(), $e->getCode());
    }
}

/**
 * Validar datos del formulario
 */
function validateFormData() {
    $requiredFields = ['name', 'email', 'phone', 'service'];
    $data = [];
    
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("El campo '{$field}' es requerido", 400);
        }
        $data[$field] = trim($_POST[$field]);
    }
    
    // Validaciones específicas
    if (strlen($data['name']) < 2 || strlen($data['name']) > 100) {
        throw new Exception('El nombre debe tener entre 2 y 100 caracteres', 400);
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('El email no es válido', 400);
    }
    
    if (!preg_match('/^[\+]?[0-9\s\-\(\)]{8,20}$/', $data['phone'])) {
        throw new Exception('El teléfono no es válido', 400);
    }
    
    $validServices = ['corte', 'color', 'tratamiento', 'combo', 'consulta'];
    if (!in_array($data['service'], $validServices)) {
        throw new Exception('Servicio no válido', 400);
    }
    
    // Mensaje opcional
    $data['message'] = isset($_POST['message']) ? trim($_POST['message']) : '';
    if (strlen($data['message']) > 1000) {
        throw new Exception('El mensaje es demasiado largo (máximo 1000 caracteres)', 400);
    }
    
    return $data;
}

/**
 * Sanitizar datos para prevenir XSS
 */
function sanitizeData($data) {
    foreach ($data as $key => $value) {
        $data[$key] = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

/**
 * Verificar rate limiting
 */
function checkRateLimit() {
    $ip = getRealIpAddr();
    $rateLimitData = loadRateLimitData();
    $now = time();
    $oneHourAgo = $now - 3600;
    
    // Limpiar datos antiguos
    if (isset($rateLimitData[$ip])) {
        $rateLimitData[$ip] = array_filter($rateLimitData[$ip], function($timestamp) use ($oneHourAgo) {
            return $timestamp > $oneHourAgo;
        });
        
        // Verificar límite
        if (count($rateLimitData[$ip]) >= MAX_REQUESTS_PER_HOUR) {
            return false;
        }
    }
    
    return true;
}

/**
 * Actualizar rate limiting
 */
function updateRateLimit() {
    $ip = getRealIpAddr();
    $rateLimitData = loadRateLimitData();
    $now = time();
    
    if (!isset($rateLimitData[$ip])) {
        $rateLimitData[$ip] = [];
    }
    
    $rateLimitData[$ip][] = $now;
    
    // Guardar datos
    file_put_contents(RATE_LIMIT_FILE, json_encode($rateLimitData, JSON_PRETTY_PRINT));
}

/**
 * Cargar datos de rate limiting
 */
function loadRateLimitData() {
    if (!file_exists(RATE_LIMIT_FILE)) {
        return [];
    }
    
    $data = file_get_contents(RATE_LIMIT_FILE);
    return json_decode($data, true) ?: [];
}

/**
 * Obtener IP real del usuario
 */
function getRealIpAddr() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Validar IP
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/**
 * Guardar datos del contacto (opcional)
 */
function saveContactData($data) {
    $contactsFile = __DIR__ . '/contacts.json';
    
    // Preparar datos para guardar
    $contactEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => getRealIpAddr(),
        'data' => $data
    ];
    
    // Cargar contactos existentes
    $contacts = [];
    if (file_exists($contactsFile)) {
        $existingData = file_get_contents($contactsFile);
        $contacts = json_decode($existingData, true) ?: [];
    }
    
    // Agregar nuevo contacto
    $contacts[] = $contactEntry;
    
    // Mantener solo los últimos 1000 contactos
    if (count($contacts) > 1000) {
        $contacts = array_slice($contacts, -1000);
    }
    
    // Guardar
    file_put_contents($contactsFile, json_encode($contacts, JSON_PRETTY_PRINT));
}

/**
 * Enviar emails de notificación
 */
function sendNotificationEmails($data) {
    $success = true;
    
    // Email al administrador
    $success &= sendAdminNotification($data);
    
    // Email de confirmación al cliente
    $success &= sendClientConfirmation($data);
    
    return $success;
}

/**
 * Enviar notificación al administrador
 */
function sendAdminNotification($data) {
    $subject = '🌟 Nuevo contacto desde ' . SITE_NAME;
    
    $serviceNames = [
        'corte' => 'Corte',
        'color' => 'Coloración',
        'tratamiento' => 'Tratamiento',
        'trenzas' => 'Trenzas & Peinados',
        'combo' => 'Combo completo',
        'consulta' => 'Consulta general'
    ];
    
    $serviceName = isset($serviceNames[$data['service']]) ? $serviceNames[$data['service']] : $data['service'];
    
    $message = "
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: linear-gradient(135deg, #d4938f, #8d5a56); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #d4938f; }
            .field-value { margin-top: 5px; padding: 10px; background: #f9f9f9; border-left: 3px solid #d4938f; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>💅 Nuevo contacto desde tu web</h1>
                <p>Alguien está interesado en tus servicios</p>
            </div>
            
            <div class='content'>
                <div class='highlight'>
                    <strong>⏰ Fecha:</strong> " . date('d/m/Y H:i:s') . "<br>
                    <strong>🎯 Servicio de interés:</strong> {$serviceName}
                </div>
                
                <div class='field'>
                    <div class='field-label'>👤 Nombre:</div>
                    <div class='field-value'>{$data['name']}</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>📧 Email:</div>
                    <div class='field-value'><a href='mailto:{$data['email']}'>{$data['email']}</a></div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>📱 WhatsApp:</div>
                    <div class='field-value'><a href='https://wa.me/{$data['phone']}'>{$data['phone']}</a></div>
                </div>
                
                " . (!empty($data['message']) ? "
                <div class='field'>
                    <div class='field-label'>💬 Mensaje:</div>
                    <div class='field-value'>{$data['message']}</div>
                </div>
                " : "") . "
                
                <div style='text-align: center; margin-top: 30px;'>
                    <a href='https://wa.me/{$data['phone']}' style='background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;'>
                        💬 Responder por WhatsApp
                    </a>
                </div>
            </div>
            
            <div class='footer'>
                <p>Este email fue enviado automáticamente desde " . SITE_NAME . "</p>
                <p>IP del visitante: " . getRealIpAddr() . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendEmail(ADMIN_EMAIL, $subject, $message);
}

/**
 * Enviar confirmación al cliente
 */
function sendClientConfirmation($data) {
    $subject = '✨ Gracias por contactar a ' . SITE_NAME;
    
    $message = "
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: linear-gradient(135deg, #d4938f, #8d5a56); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .highlight { background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { background: #d4938f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🌟 ¡Hola {$data['name']}!</h1>
                <p>Gracias por contactarnos</p>
            </div>
            
            <div class='content'>
                <p>Recibimos tu consulta y estamos emocionadas de poder ayudarte a realzar tu belleza natural.</p>
                
                <div class='highlight'>
                    <strong>📝 Resumen de tu consulta:</strong><br>
                    <strong>Servicio:</strong> {$data['service']}<br>
                    <strong>Email:</strong> {$data['email']}<br>
                    <strong>WhatsApp:</strong> {$data['phone']}
                </div>
                
                <h3 style='color: #d4938f;'>⏰ ¿Qué sigue?</h3>
                <ul style='line-height: 2;'>
                    <li>🕐 Te contactaremos dentro de las próximas <strong>24 horas</strong></li>
                    <li>📱 Lo haremos por WhatsApp o email, según prefieras</li>
                    <li>📅 Coordinaremos el mejor horario para tu cita</li>
                    <li>💅 ¡Y comenzaremos a trabajar en tu nueva imagen!</li>
                </ul>
                
                <div style='text-align: center;'>
                    <a href='https://wa.me/5491112345678' class='button'>
                        💬 Escribinos por WhatsApp
                    </a>
                </div>
                
                <h3 style='color: #d4938f;'>📍 Nuestra ubicación:</h3>
                <p>Av. Principal 1234, Ciudad<br>
                📞 +54 9 11 1234-5678<br>
                ⏰ Lun-Vie: 9:00-19:00 | Sáb: 9:00-17:00</p>
                
                <p style='margin-top: 30px; font-style: italic; color: #666;'>
                    Mientras tanto, podés seguirnos en nuestras redes para ver más trabajos y consejos de belleza.
                </p>
            </div>
            
            <div class='footer'>
                <p>¡Gracias por elegir " . SITE_NAME . "!</p>
                <p>Si tenés alguna pregunta urgente, no dudes en escribirnos.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendEmail($data['email'], $subject, $message);
}

/**
 * Función auxiliar para enviar emails
 */
function sendEmail($to, $subject, $message) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: ' . SITE_NAME . ' <' . SITE_EMAIL . '>',
        'Reply-To: ' . SITE_EMAIL,
        'X-Mailer: PHP/' . phpversion(),
        'X-Priority: 3',
        'Return-Path: ' . SITE_EMAIL
    ];
    
    $headerString = implode("\r\n", $headers);
    
    // Intentar enviar email
    $success = @mail($to, $subject, $message, $headerString);
    
    if (!$success) {
        error_log("Error enviando email a: {$to}");
    }
    
    return $success;
}

/**
 * Enviar respuesta JSON
 */
function sendJsonResponse($success, $message, $code = null) {
    if ($code) {
        http_response_code($code);
    }
    
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);
    
    exit;
}

// ================================
// EJECUCIÓN PRINCIPAL
// ================================

// Verificar si es una solicitud AJAX
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    processContactForm();
} else {
    // Si no es AJAX, redirigir al inicio
    header('Location: ../index.html');
    exit;
}
?>
