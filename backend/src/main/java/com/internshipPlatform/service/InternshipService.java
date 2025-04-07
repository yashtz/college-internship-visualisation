package com.internshipPlatform.service;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InternshipService {
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }
    
    public Internship createInternship(Internship internship) {
        if (internship == null) {
            throw new IllegalArgumentException("Internship cannot be null");
        }
        internship.setCreatedAt(LocalDateTime.now());
        internship.setUpdatedAt(LocalDateTime.now());
        return internshipRepository.save(internship);
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