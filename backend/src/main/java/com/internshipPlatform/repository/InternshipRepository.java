package com.internshipPlatform.repository;

import com.internshipPlatform.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
}