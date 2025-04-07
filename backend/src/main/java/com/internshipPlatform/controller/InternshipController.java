package com.internshipPlatform.controller;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend to access
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }
}