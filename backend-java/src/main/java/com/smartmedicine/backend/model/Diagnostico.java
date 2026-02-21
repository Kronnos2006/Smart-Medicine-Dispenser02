package com.smartmedicine.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Entidad que representa un diagnóstico realizado por el sistema.
 * Cumple con los principios de POO y persistencia de datos.
 */
@Data
@Entity
@Table(name = "diagnosticos")
public class Diagnostico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String enfermedadDetectada;

    @Column(nullable = false)
    private String pastillaAsignada;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Column(columnDefinition = "TEXT")
    private String recomendacionIA;

    public Diagnostico() {
        this.fechaHora = LocalDateTime.now();
    }
}
