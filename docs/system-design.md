# Smart Complaint & Escalation System

---

## 1. DATABASE SCHEMA

### User
- id (BIGINT, PK)
- name
- email
- password_hash
- role_id (FK)
- created_at

### Role
- id
- name (USER, ADMIN, AGENT)

### Complaint
- id
- title
- description
- status_id (FK)
- priority_id (FK)
- user_id (FK)
- assigned_agent_id (FK)
- escalation_threshold_hours
- created_at
- updated_at

### Status
- id
- name (OPEN, ASSIGNED, etc.)

### Priority
- id
- name (LOW, MEDIUM, HIGH)

### EscalationLog
- id
- complaint_id
- escalated_from_status_id
- escalated_to_status_id
- level
- reason
- escalated_at

### Notification
- id
- user_id
- complaint_id
- type
- message
- read_status
- created_at

### Comment
- id
- complaint_id
- user_id
- message
- created_at

---

## 2. APIs

POST   /api/complaints  
GET    /api/complaints  
GET    /api/complaints/{id}  
PUT    /api/complaints/{id}/assign  
PUT    /api/complaints/{id}/status  
GET    /api/complaints/{id}/escalations  
GET    /api/users/agents  
GET    /api/dashboard/metrics  

---

## 3. LIFECYCLE RULES

OPEN → ASSIGNED → IN_PROGRESS → ESCALATED → RESOLVED → CLOSED

Allowed transitions:
- OPEN → ASSIGNED
- ASSIGNED → IN_PROGRESS
- IN_PROGRESS → ESCALATED
- IN_PROGRESS → RESOLVED
- ESCALATED → RESOLVED
- RESOLVED → CLOSED

Rules:
- USER creates complaint → OPEN
- ADMIN assigns → ASSIGNED
- AGENT works → IN_PROGRESS
- Auto escalation based on SLA
- ADMIN closes complaint