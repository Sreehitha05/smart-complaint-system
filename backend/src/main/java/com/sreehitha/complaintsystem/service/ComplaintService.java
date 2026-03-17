package com.sreehitha.complaintsystem.service;

import com.sreehitha.complaintsystem.entity.Complaint;
import com.sreehitha.complaintsystem.entity.User;
import com.sreehitha.complaintsystem.repository.ComplaintRepository;
import com.sreehitha.complaintsystem.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint) {
        complaint.setStatus("OPEN");
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    @Autowired
    private UserRepository userRepository;

    public Complaint assignComplaint(Long complaintId, Long agentId) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        complaint.setAssignedAgent(agent);
        complaint.setStatus("ASSIGNED");

        return complaintRepository.save(complaint);
    }

    public Complaint updateStatus(Long complaintId, String status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }
}