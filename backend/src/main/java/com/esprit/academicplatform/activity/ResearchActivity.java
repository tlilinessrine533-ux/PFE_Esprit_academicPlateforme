package com.esprit.academicplatform.activity;

import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.ResearchPublicationRank;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "research_activities")
@PrimaryKeyJoinColumn(name = "activity_id")
@DiscriminatorValue("RECHERCHE")
public class ResearchActivity extends Activity {

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_type", nullable = false, length = 30)
    private PublicationType publicationType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "venue_name", nullable = false, length = 255)
    private String venueName;

    @Column(name = "publication_year", nullable = false)
    private Integer publicationYear;

    @Column(name = "indexing_name", length = 100)
    private String indexingName;

    @Column(length = 100)
    private String doi;

    @Column(name = "student_name", length = 150)
    private String studentName;

    @Column(name = "pfe_level", length = 100)
    private String pfeLevel;

    @Column(length = 180)
    private String deliverable;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_rank", length = 20)
    private ResearchPublicationRank publicationRank;

    @Column(name = "activity_points", nullable = false, precision = 8, scale = 2)
    private BigDecimal activityPoints;
}
