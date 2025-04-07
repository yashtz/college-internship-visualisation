package com.internshipPlatform.controller;

import com.internshipPlatform.model.Admin;
import com.internshipPlatform.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        Admin newAdmin = adminService.createAdmin(admin.getUsername(), admin.getPassword());
        return ResponseEntity.ok(newAdmin);
    }
}
