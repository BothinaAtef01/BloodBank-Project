<?php

require_once __DIR__ . '/../config/db.php';


//نسجل اي تعديل حصل في جدول ال reports مثلا
function auditLog(array $opts): void {
    try {
        $db   = getDB();
        $stmt = $db->prepare('
            INSERT INTO REPORTS (user_id, action, target_table, target_id, old_value, new_value, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $opts['userId'],
            $opts['action'],
            $opts['targetTable']  ?? null,
            $opts['targetId']     ?? null,
            isset($opts['oldValue']) ? json_encode($opts['oldValue']) : null,
            isset($opts['newValue']) ? json_encode($opts['newValue']) : null,
            $opts['ipAddress']    ?? null,
        ]);
    } catch (Exception $e) {
        error_log('Audit log error: ' . $e->getMessage());
    }
}