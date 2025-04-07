package com.internshipPlatform.controller;

import com.internshipPlatform.service.CSVMigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/migration")
public class MigrationController {

    private static final Logger logger = LoggerFactory.getLogger(MigrationController.class);

    @Autowired
    private CSVMigrationService csvMigrationService;

    @PostMapping("/csv")
    public ResponseEntity<String> migrateCSV() {
        logger.info("Starting CSV migration...");
        try {
            csvMigrationService.migrateCSVToMongoDB();
            logger.info("Migration completed successfully");
            return ResponseEntity.ok("Migration completed successfully");
        } catch (Exception e) {
            logger.error("Migration failed: " + e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("Migration failed: " + e.getMessage());
        }
    }
}