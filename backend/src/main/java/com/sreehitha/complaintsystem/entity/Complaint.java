package com.sreehitha.complaintsystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String status;   // OPEN, ASSIGNED, RESOLVED

    private String priority; // LOW, MEDIUM, HIGH

    // Who created the complaint
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Who is assigned to handle it
    @ManyToOne
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    private LocalDateTime createdAt;

    // Automatically set values before saving
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = "OPEN";
        }
    }
}