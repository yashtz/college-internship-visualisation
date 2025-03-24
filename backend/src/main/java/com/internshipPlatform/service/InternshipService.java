package main.java.com.internshipPlatform.service;

import com.internshipPlatform.model.Internship;
import com.internshipPlatform.repository.InternshipRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InternshipService {

    private final InternshipRepository repository;

    public InternshipService(InternshipRepository repository) {
        this.repository = repository;
    }

    public List<Internship> getAllInternships() {
        return repository.findAll();
    }
}