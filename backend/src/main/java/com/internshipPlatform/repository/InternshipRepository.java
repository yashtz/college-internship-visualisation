package com.internshipPlatform.repository;

import com.internshipPlatform.model.Internship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import java.util.List;

public interface InternshipRepository extends MongoRepository<Internship, ObjectId> {
    List<Internship> findByLocation(String location);
    List<Internship> findByProfile(String profile);
}