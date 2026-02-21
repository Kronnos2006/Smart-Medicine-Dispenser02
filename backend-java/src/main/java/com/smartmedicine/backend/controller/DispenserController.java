package com.smartmedicine.backend.controller;

import com.smartmedicine.backend.model.Dispensacion;
import com.smartmedicine.backend.service.GeminiService;
import com.smartmedicine.backend.repository.DispensacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dispenser")
@CrossOrigin(origins = "*")
public class DispenserController {

    @Autowired
    private DispensacionRepository repository;

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/history")
    public List<Dispensacion> getHistory() {
        return repository.findAll();
    }

    @PostMapping("/record")
    public Dispensacion recordDispensacion(@RequestBody Dispensacion data) {
        return repository.save(data);
    }

    @GetMapping("/analyze")
    public String analyzeData() {
        List<Dispensacion> history = repository.findAll();
        return geminiService.getRecommendations(history);
    }
}
