// constants/astronomy.ts

/**
 * ============================================================================
 * Base scale
 * ============================================================================
 *
 * 1 unit = 1 Earth diameter.
 */

export const EARTH_DIAMETER_KM = 12_742;

export const SCALE = 1 / EARTH_DIAMETER_KM;

/**
 * ============================================================================
 * Earth
 * ============================================================================
 */

export const EARTH_DIAMETER = 1;
export const EARTH_RADIUS = 0.5;

/**
 * ============================================================================
 * Moon
 * ============================================================================
 */

export const MOON_DIAMETER_KM = 3_474.8;
export const MOON_DIAMETER = MOON_DIAMETER_KM * SCALE;
export const MOON_RADIUS = MOON_DIAMETER / 2;

/**
 * Mean Earth-Moon distance.
 *
 * This is the semi-major axis of the Moon's orbit around the
 * Earth-Moon barycenter, approximately.
 */
export const MOON_SEMI_MAJOR_AXIS_KM = 384_400;
export const MOON_SEMI_MAJOR_AXIS = MOON_SEMI_MAJOR_AXIS_KM * SCALE;

/**
 * Moon orbital eccentricity.
 */
export const MOON_ECCENTRICITY = 0.0549;

/**
 * Moon orbital period.
 *
 * Sidereal orbital period.
 */
export const MOON_ORBITAL_PERIOD_DAYS = 27.321661;

/**
 * ============================================================================
 * Sun / Earth orbit
 * ============================================================================
 */

export const SUN_DIAMETER_KM = 1_391_400;
export const SUN_DIAMETER = SUN_DIAMETER_KM * SCALE;
export const SUN_RADIUS = SUN_DIAMETER / 2;

/**
 * Astronomical Unit.
 *
 * Mean Earth-Sun distance.
 */
export const AU_KM = 149_597_870.7;
export const AU = AU_KM * SCALE;

/**
 * Earth's orbital eccentricity.
 */
export const EARTH_ORBITAL_ECCENTRICITY = 0.0167086;

/**
 * Sidereal year.
 */
export const EARTH_ORBITAL_PERIOD_DAYS = 365.256363004;

/**
 * ============================================================================
 * Useful constants
 * ============================================================================
 */

export const TWO_PI = Math.PI * 2;
export const DAY_SECONDS = 86_400;
