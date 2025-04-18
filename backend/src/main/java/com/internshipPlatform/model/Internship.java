package com.internshipPlatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import java.time.LocalDateTime;

@Document(collection = "internships")
public class Internship {
    @Id
    private ObjectId id;

    // Add this getter to return string representation
    public String getStringId() {
        return id != null ? id.toHexString() : null;
    }
    private String title;
    private String company;
    private String location;
    private String startDate;
    private String duration;
    private String stipend;
    private String profile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public Internship() {}

    // Getters
    public ObjectId getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getStartDate() { return startDate; }
    public String getStipend() { return stipend; }
    public String getDuration() { return duration; }
    public String getProfile() { return profile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(ObjectId id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public void setStipend(String stipend) { this.stipend = stipend; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setProfile(String profile) { this.profile = profile; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}