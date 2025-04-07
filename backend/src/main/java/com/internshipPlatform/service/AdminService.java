package com.internshipPlatform.service;

import com.internshipPlatform.model.Admin;
import com.internshipPlatform.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Admin createAdmin(String username, String password) {
        Admin admin = new Admin(username, passwordEncoder.encode(password));
        return adminRepository.save(admin);
    }
    
    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }
}