package main.java.com.internshipPlatform.service;

import com.internshipplatform.model.Admin;
import com.internshipplatform.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public Admin findByUsername(String username) {
        return repository.findByUsername(username);
    }
}