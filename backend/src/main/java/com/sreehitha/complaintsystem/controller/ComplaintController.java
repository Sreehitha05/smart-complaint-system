package com.sreehitha.complaintsystem.controller;

import com.sreehitha.complaintsystem.entity.Complaint;
import com.sreehitha.complaintsystem.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintService.createComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/user/{userId}")
    public List<Complaint> getByUser(@PathVariable Long userId) {
        return complaintService.getComplaintsByUser(userId);
    }
    @PutMapping("/{id}/assign/{agentId}")
    public Complaint assignComplaint(@PathVariable Long id,@PathVariable Long agentId) {
        return complaintService.assignComplaint(id, agentId);
    }

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id,@RequestParam String status) {
        return complaintService.updateStatus(id, status);
    }
}