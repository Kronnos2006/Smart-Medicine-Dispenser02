package com.smartmedicine.backend.service;

import com.smartmedicine.backend.model.Diagnostico;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Servicio encargado de la integración con la API de Modelos de Lenguaje (LLM).
 */
@Service
public class GeminiService {
    
    /**
     * Genera recomendaciones automáticas basadas en el historial de diagnósticos.
     * @param history Lista de diagnósticos previos.
     * @return Recomendación generada por la IA.
     */
    public String getRecommendations(List<Diagnostico> history) {
        // En la implementación final, aquí se realizaría la petición HTTP a la API de Gemini.
        if (history.isEmpty()) return "No hay datos suficientes para analizar.";
        
        Diagnostico ultimo = history.get(history.size() - 1);
        return "Se detectó " + ultimo.getEnfermedadDetectada() + ". Se recomienda reposo y seguir la dosis de " + ultimo.getPastillaAsignada() + ". Si los síntomas persisten, consulte a un médico.";
    }
}
