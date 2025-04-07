package com.internshipPlatform.repository;

import com.internshipPlatform.model.Internship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipRepository extends MongoRepository<Internship, String> {
    List<Internship> findByLocation(String location);
    List<Internship> findByProfile(String profile);
}