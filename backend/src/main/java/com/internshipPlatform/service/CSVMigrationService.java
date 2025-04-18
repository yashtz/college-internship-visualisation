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
            String[] headers = reader.readNext();
            logger.info("CSV headers: {}", String.join(", ", headers));
            
            String[] line;
            int count = 0;
            while ((line = reader.readNext()) != null) {
                try {
                    logger.info("Raw CSV line: {}", String.join(", ", line));
                    
                    Internship internship = new Internship();
                    internship.setTitle(line[0]);          // internship_title
                    internship.setCompany(line[1]);        // company_name
                    internship.setLocation(line[2]);       // location
                    internship.setStartDate(line[3]);      // start_date
                    internship.setDuration(line[4]);       // duration
                    internship.setStipend(line[5]);        // stipend
                    internship.setCreatedAt(LocalDateTime.now());
                    internship.setUpdatedAt(LocalDateTime.now());
                    
                    logger.info("Created internship object: title={}, company={}, location={}, startDate={}, duration={}, stipend={}", 
                        internship.getTitle(),
                        internship.getCompany(),
                        internship.getLocation(),
                        internship.getStartDate(),
                        internship.getDuration(),
                        internship.getStipend()
                    );
                    
                    internshipService.createInternship(internship);
                    count++;
                } catch (ArrayIndexOutOfBoundsException e) {
                    logger.error("Error processing line: {}", String.join(", ", line));
                    throw new RuntimeException("CSV line has incorrect number of columns", e);
                }
            }
            logger.info("Successfully migrated {} internships", count);
        }
    }
}