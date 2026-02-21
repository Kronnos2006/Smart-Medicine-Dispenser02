package com.smartmedicine.backend.service;

import com.smartmedicine.backend.model.Dispensacion;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class GeminiService {
    
    // En un entorno real, aquí se llamaría a la API de Gemini usando HTTP
    public String getRecommendations(List<Dispensacion> history) {
        // Lógica para construir el prompt y llamar a Gemini
        return "Basado en el historial, el paciente ha cumplido con el 90% de sus dosis. Se recomienda mantener el horario actual.";
    }
}
