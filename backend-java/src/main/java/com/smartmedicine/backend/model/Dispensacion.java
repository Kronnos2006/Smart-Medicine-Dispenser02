package com.smartmedicine.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "dispensaciones")
public class Dispensacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicamento;
    private LocalDateTime fechaHora;
    private boolean exitosa;
    private Integer nivelStock;

    public Dispensacion() {
        this.fechaHora = LocalDateTime.now();
    }
}
