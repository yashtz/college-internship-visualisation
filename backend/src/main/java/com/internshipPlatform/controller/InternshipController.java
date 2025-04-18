package com.internshipPlatform.controller;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.service.InternshipService;
import com.internshipPlatform.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.bson.types.ObjectId;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "http://localhost:3000", 
             allowCredentials = "true",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInternship(@PathVariable(name = "id") String id) {
        System.out.println("Received ID in controller: " + id);
        internshipService.deleteInternship(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    @PostMapping
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) {
        System.out.println("Received create request with data: " + internship);
        Internship createdInternship = internshipService.createInternship(internship);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInternship);
    }
}