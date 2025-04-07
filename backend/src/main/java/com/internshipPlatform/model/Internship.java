package com.internshipPlatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "internships")
public class Internship {
    @Id
    private String id;
    private String title;
    private String company;
    private String location;
    private String stipend;
    private String duration;
    private String profile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public Internship() {}

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getStipend() { return stipend; }
    public String getDuration() { return duration; }
    public String getProfile() { return profile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setStipend(String stipend) { this.stipend = stipend; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setProfile(String profile) { this.profile = profile; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}