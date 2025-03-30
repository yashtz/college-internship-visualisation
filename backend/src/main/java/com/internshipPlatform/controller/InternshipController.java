package com.internshipPlatform.controller;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.service.InternshipService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/internships")
public class InternshipController {

    private final InternshipService service;

    public InternshipController(InternshipService service) {
        this.service = service;
    }

    @GetMapping
    public List<Internship> getAllInternships() {
        return service.getAllInternships();
    }
}