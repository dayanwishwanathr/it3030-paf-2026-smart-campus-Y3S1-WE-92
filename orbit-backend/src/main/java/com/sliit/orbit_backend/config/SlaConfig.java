package com.sliit.orbit_backend.config;

import java.time.Duration;
import java.util.Map;

/**
 * Static SLA threshold definitions per ticket priority.
 *
 * Thresholds:
 *   CRITICAL → respond within  4 h, resolve within  24 h
 *   HIGH     → respond within  8 h, resolve within  48 h
 *   MEDIUM   → respond within 24 h, resolve within  72 h
 *   LOW      → respond within 48 h, resolve within 120 h
 *
 * Module C – Service-Level Timer (Innovation Feature)
 * Member 3 — Shiroshi Fernando
 */
public final class SlaConfig {

    private record Threshold(long respondHours, long resolveHours) {}

    private static final Map<String, Threshold> THRESHOLDS = Map.of(
        "CRITICAL", new Threshold(4,   24),
        "HIGH",     new Threshold(8,   48),
        "MEDIUM",   new Threshold(24,  72),
        "LOW",      new Threshold(48, 120)
    );

    private static Threshold get(String priority) {
        String key = (priority != null) ? priority.toUpperCase() : "MEDIUM";
        return THRESHOLDS.getOrDefault(key, THRESHOLDS.get("MEDIUM"));
    }

    /** Maximum duration allowed before a technician must first respond. */
    public static Duration respondBy(String priority) {
        return Duration.ofHours(get(priority).respondHours());
    }

    /** Maximum duration allowed before the ticket must be resolved. */
    public static Duration resolveBy(String priority) {
        return Duration.ofHours(get(priority).resolveHours());
    }

    /** Hours to first-respond, for display purposes. */
    public static long respondHours(String priority) {
        return get(priority).respondHours();
    }

    /** Hours to resolve, for display purposes. */
    public static long resolveHours(String priority) {
        return get(priority).resolveHours();
    }

    private SlaConfig() { /* utility class */ }
}
