package main.java.com.internshipPlatform.repository;

import com.internshipplatform.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
}