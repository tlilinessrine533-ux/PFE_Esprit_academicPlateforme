package com.esprit.academicplatform.user;

import com.esprit.academicplatform.activity.Activity;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.notification.Notification;
import com.esprit.academicplatform.reporting.Report;
import com.esprit.academicplatform.validation.ValidationHistory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "phone_number", unique = true, length = 30)
    private String phoneNumber;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RoleType role;

    @Enumerated(EnumType.STRING)
    @Column(name = "teacher_type", length = 20)
    private TeacherType teacherType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user")
    private Set<Activity> activities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "actor")
    private Set<ValidationHistory> validationsPerformed = new LinkedHashSet<>();

    @OneToMany(mappedBy = "generatedBy")
    private Set<Report> generatedReports = new LinkedHashSet<>();

    @OneToMany(mappedBy = "targetUser")
    private Set<Report> receivedReports = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications = new LinkedHashSet<>();

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public TeacherType effectiveTeacherType() {
        return role == RoleType.ENSEIGNANT ? (teacherType != null ? teacherType : TeacherType.PERMANENT) : null;
    }

    public boolean isTeacherWithoutPoints() {
        return role == RoleType.ENSEIGNANT && effectiveTeacherType() == TeacherType.VACATAIRE;
    }
}
