package com.internshipPlatform.service;

import com.internshipPlatform.model.Internship;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.InputStreamReader;
import java.time.LocalDateTime;

@Service
public class CSVMigrationService {

    private static final Logger logger = LoggerFactory.getLogger(CSVMigrationService.class);

    @Autowired
    private InternshipService internshipService;

    public void migrateCSVToMongoDB() throws Exception {
        logger.info("Attempting to read CSV file from resources...");
        ClassPathResource resource = new ClassPathResource("internships.csv");
        
        if (!resource.exists()) {
            logger.error("CSV file not found in resources folder");
            throw new RuntimeException("CSV file not found in resources folder");
        }
        
        logger.info("Found CSV file, starting migration...");
        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            // Skip the header row
            String[] headers = reader.readNext();
            logger.info("CSV headers: {}", String.join(", ", headers));
            
            String[] line;
            int count = 0;
            while ((line = reader.readNext()) != null) {
                Internship internship = new Internship();
                internship.setTitle(line[0]);
                internship.setCompany(line[1]);
                internship.setLocation(line[2]);
                internship.setDuration(line[3]);
                internship.setStipend(line[4]);
                internship.setProfile(line[5]);
                internship.setCreatedAt(LocalDateTime.now());
                internship.setUpdatedAt(LocalDateTime.now());
                
                internshipService.createInternship(internship);
                count++;
            }
            logger.info("Successfully migrated {} internships", count);
        }
    }
}