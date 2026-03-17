package com.sreehitha.complaintsystem.repository;

import com.sreehitha.complaintsystem.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUserId(Long userId);

    List<Complaint> findByAssignedAgentId(Long agentId);

    List<Complaint> findByStatus(String status);
}