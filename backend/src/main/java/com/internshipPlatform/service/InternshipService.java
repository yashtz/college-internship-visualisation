package com.internshipPlatform.service;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.repository.InternshipRepository;
import com.internshipPlatform.exception.ResourceNotFoundException;
import com.internshipPlatform.exception.BadRequestException;  // Add this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.bson.types.ObjectId;

@Service
@Transactional
public class InternshipService {
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    public void deleteInternship(String hexId) {
        try {
            ObjectId objectId = new ObjectId(hexId);
            Optional<Internship> internship = internshipRepository.findById(objectId);
            if (internship.isPresent()) {
                internshipRepository.deleteById(objectId);
            } else {
                throw new ResourceNotFoundException("Internship not found with id: " + hexId);
            }
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid internship ID format: " + hexId);
        }
    }
    
    public List<Internship> getAllInternships() {
        System.out.println("Fetching all internships...");
        List<Internship> internships = internshipRepository.findAll();
        // Sort by createdAt in descending order (newest first)
        internships.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        System.out.println("Total internships found: " + internships.size());
        return internships;
    }
    
    public Internship createInternship(Internship internship) {
        System.out.println("Received internship data: " + internship);
        try {
            if (internship == null) {
                throw new BadRequestException("Internship cannot be null");
            }
            
            // Set the timestamps
            internship.setCreatedAt(LocalDateTime.now());
            internship.setUpdatedAt(LocalDateTime.now());
            
            // Save and get the result
            Internship savedInternship = internshipRepository.save(internship);
            System.out.println("Saved internship with ID: " + savedInternship.getStringId());
            
            return savedInternship;
        } catch (Exception e) {
            System.out.println("Error creating internship: " + e.getMessage());
            throw new BadRequestException("Failed to create internship: " + e.getMessage());
        }
    }
    
    public List<Internship> getInternshipsByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location cannot be null or empty");
        }
        return internshipRepository.findByLocation(location);
    }
    
    public List<Internship> getInternshipsByProfile(String profile) {
        if (profile == null || profile.trim().isEmpty()) {
            throw new IllegalArgumentException("Profile cannot be null or empty");
        }
        return internshipRepository.findByProfile(profile);
    }
}