package com.smartmedicine.backend.controller;

import com.smartmedicine.backend.model.Diagnostico;
import com.smartmedicine.backend.service.GeminiService;
import com.smartmedicine.backend.repository.DiagnosticoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de diagnósticos y comunicación con hardware/IA.
 */
@RestController
@RequestMapping("/api/v1/diagnostics")
@CrossOrigin(origins = "*")
public class DiagnosticController {

    @Autowired
    private DiagnosticoRepository repository;

    @Autowired
    private GeminiService geminiService;

    /**
     * Obtiene el historial completo de diagnósticos.
     */
    @GetMapping
    public List<Diagnostico> getAllDiagnostics() {
        return repository.findAll();
    }

    /**
     * Registra un nuevo diagnóstico proveniente del hardware.
     */
    @PostMapping
    public ResponseEntity<Diagnostico> createDiagnostic(@RequestBody Diagnostico diagnostico) {
        Diagnostico saved = repository.save(diagnostico);
        return ResponseEntity.ok(saved);
    }

    /**
     * Solicita a la IA un análisis basado en el historial.
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<Diagnostico> analyzeDiagnostic(@PathVariable Long id) {
        return repository.findById(id).map(diag -> {
            String recommendation = geminiService.getRecommendations(List.of(diag));
            diag.setRecomendacionIA(recommendation);
            return ResponseEntity.ok(repository.save(diag));
        }).orElse(ResponseEntity.notFound().build());
    }
}
