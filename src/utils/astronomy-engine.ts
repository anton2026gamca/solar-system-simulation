import * as THREE from 'three';

export interface Vector3D { x: number; y: number; z: number; }

export interface OrbitalElements {
  a0: number; aCy: number;
  e0: number; eCy: number;
  i0: number; iCy: number;
  L0: number; LCy: number;
  longPeri0: number; longPeriCy: number;
  longNode0: number; longNodeCy: number;
}

export interface MoonProfile {
  name: string;
  color: string;
  radiusAu: number;
  a: number;
  e: number;
  i: number;
  periodDays: number;
  anomalisticPeriodDays?: number;
  longNode: number;
  argPeri: number;
  meanAnomaly0: number;
  retrograde?: boolean;
  longNodeCyDay?: number;
  argPeriCyDay?: number;
}

export interface PlanetRotationElements {
  ra0: number;
  raCy: number;
  dec0: number;
  decCy: number;
  w0: number;
  wDay: number;
}

export interface PlanetProfile {
  name: string;
  color: string;
  radiusAu: number;
  rotation: PlanetRotationElements;
  elements: OrbitalElements;
  moons?: Record<string, MoonProfile>;
}

export const REALISTIC_PLANETS: Record<string, PlanetProfile> = {
  mercury: {
    name: 'Mercury', color: '#9e9e9e', radiusAu: 0.0000163,
    rotation: { ra0: 270.0, raCy: 0.0, dec0: 89.97, decCy: 0.0, w0: 329.54, wDay: 6.1385025 },
    elements: { a0: 0.38709893, aCy: 0.00000066, e0: 0.20563069, eCy: 0.00002040, i0: 7.00487, iCy: -0.00594, L0: 252.25084, LCy: 149472.67411, longPeri0: 77.45645, longPeriCy: 0.15901, longNode0: 48.33167, longNodeCy: -0.12531 }
  },
  venus: {
    name: 'Venus', color: '#e3bb76', radiusAu: 0.0000404,
    rotation: { ra0: 90.0, raCy: 0.0, dec0: -87.24, decCy: 0.0, w0: 160.20, wDay: -1.4813688 },
    elements: { a0: 0.72333199, aCy: 0.00000092, e0: 0.00677323, eCy: -0.00004776, i0: 3.39471, iCy: -0.00078, L0: 181.97973, LCy: 58517.81538, longPeri0: 131.53298, longPeriCy: 0.00213, longNode0: 76.68069, longNodeCy: -0.27769 }
  },
  earth: {
    name: 'Earth', color: '#2f82c4', radiusAu: 0.0000426,
    rotation: { ra0: 90.0, raCy: 0.0, dec0: 66.56, decCy: -0.013, w0: 190.147, wDay: 360.9856235 },
    elements: { a0: 1.00000011, aCy: -0.00000005, e0: 0.01671022, eCy: -0.00003804, i0: 0.00005, iCy: -0.01300, L0: 100.46435, LCy: 36000.76983, longPeri0: 102.94719, longPeriCy: 0.32225, longNode0: -11.26064, longNodeCy: -0.41322 },
    moons: {
      moon: {
        name: 'The Moon', color: '#b0bec5', radiusAu: 1737.4 / 149597870.7,
        a: 384400 / 149597870.7, e: 0.0554, i: 5.16,
        periodDays: 27.321661, anomalisticPeriodDays: 27.554550,
        longNode: 125.08, argPeri: 318.15, meanAnomaly0: 135.27,
        longNodeCyDay: -360 / 6798.383,
        argPeriCyDay: 360 / 3232.6054 + 360 / 6798.383
      }
    }
  },
  mars: {
    name: 'Mars', color: '#e06138', radiusAu: 0.0000227,
    rotation: { ra0: 347.14, raCy: 0.0, dec0: 64.78, decCy: 0.0, w0: 176.63, wDay: 350.8919822 },
    elements: { a0: 1.52366231, aCy: -0.00000497, e0: 0.09341233, eCy: 0.00011902, i0: 1.85061, iCy: -0.00724, L0: 355.45332, LCy: 19140.30268, longPeri0: 336.04084, longPeriCy: 0.44388, longNode0: 49.57854, longNodeCy: -0.29411 },
    moons: {
      phobos: { name: 'Phobos', color: '#8d6e63', radiusAu: 11.08 / 149597870.7, a: 9375 / 149597870.7, e: 0.015, i: 1.1, periodDays: 0.3187, longNode: 169.2, argPeri: 216.3, meanAnomaly0: 189.7 },
      deimos: { name: 'Deimos', color: '#bcaaa4', radiusAu: 6.2 / 149597870.7, a: 23457 / 149597870.7, e: 0.000, i: 1.8, periodDays: 1.2625, longNode: 54.3, argPeri: 0.0, meanAnomaly0: 205.0 }
    }
  },
  jupiter: {
    name: 'Jupiter', color: '#d4a373', radiusAu: 0.0004673,
    rotation: { ra0: 270.0, raCy: 0.0, dec0: 86.87, decCy: 0.0, w0: 284.95, wDay: 870.5360000 },
    elements: { a0: 5.20336301, aCy: 0.00060737, e0: 0.04839266, eCy: -0.00012880, i0: 1.30530, iCy: -0.00415, L0: 34.40438, LCy: 3034.74612, longPeri0: 14.75385, longPeriCy: 0.19152, longNode0: 100.55615, longNodeCy: 0.20426 },
    moons: {
      io: { name: 'Io', color: '#e6c229', radiusAu: 1821.49 / 149597870.7, a: 421800 / 149597870.7, e: 0.004, i: 0.0, periodDays: 1.762732, longNode: 0.0, argPeri: 49.1, meanAnomaly0: 330.9 },
      europa: { name: 'Europa', color: '#b8b8b8', radiusAu: 1560.80 / 149597870.7, a: 671100 / 149597870.7, e: 0.009, i: 0.5, periodDays: 3.525463, longNode: 184.0, argPeri: 45.0, meanAnomaly0: 345.4 },
      ganymede: { name: 'Ganymede', color: '#a3937b', radiusAu: 2631.20 / 149597870.7, a: 1070400 / 149597870.7, e: 0.001, i: 0.2, periodDays: 7.155588, longNode: 58.5, argPeri: 198.3, meanAnomaly0: 324.8 },
      callisto: { name: 'Callisto', color: '#615c53', radiusAu: 2410.30 / 149597870.7, a: 1882700 / 149597870.7, e: 0.007, i: 0.3, periodDays: 16.690440, longNode: 309.1, argPeri: 43.8, meanAnomaly0: 87.4 },
      himalia: { name: 'Himalia', color: '#a19c92', radiusAu: 85.0 / 149597870.7, a: 11439000 / 149597870.7, e: 0.160, i: 28.4, periodDays: 249.9090, longNode: 64.2, argPeri: 321.1, meanAnomaly0: 78.3 },
      elara: { name: 'Elara', color: '#8c8880', radiusAu: 43.0 / 149597870.7, a: 11710700 / 149597870.7, e: 0.212, i: 27.8, periodDays: 258.8861, longNode: 112.8, argPeri: 129.9, meanAnomaly0: 346.9 },
      lysithea: { name: 'Lysithea', color: '#7a7771', radiusAu: 18.0 / 149597870.7, a: 11699100 / 149597870.7, e: 0.117, i: 27.7, periodDays: 258.5035, longNode: 9.2, argPeri: 48.3, meanAnomaly0: 328.5 },
      ananke: { name: 'Ananke', color: '#807b73', radiusAu: 14.0 / 149597870.7, a: 21029500 / 149597870.7, e: 0.238, i: 147.6, periodDays: 623.1097, longNode: 13.7, argPeri: 78.8, meanAnomaly0: 271.7, retrograde: true },
      carme: { name: 'Carme', color: '#6e6a61', radiusAu: 23.0 / 149597870.7, a: 23139200 / 149597870.7, e: 0.261, i: 164.6, periodDays: 719.2806, longNode: 115.5, argPeri: 6.5, meanAnomaly0: 259.5, retrograde: true },
      pasiphae: { name: 'Pasiphae', color: '#5c5952', radiusAu: 30.0 / 149597870.7, a: 23463200 / 149597870.7, e: 0.412, i: 148.3, periodDays: 734.4215, longNode: 315.7, argPeri: 172.8, meanAnomaly0: 279.3, retrograde: true },
      sinope: { name: 'Sinope', color: '#4d4b45', radiusAu: 14.0 / 149597870.7, a: 23679300 / 149597870.7, e: 0.262, i: 157.3, periodDays: 744.5951, longNode: 308.0, argPeri: 354.3, meanAnomaly0: 157.4, retrograde: true }
    }
  },
  saturn: {
    name: 'Saturn', color: '#f4e2bb', radiusAu: 0.0003893,
    rotation: { ra0: 40.58, raCy: 0.0, dec0: 63.27, decCy: 0.0, w0: 38.90, wDay: 810.7939024 },
    elements: { a0: 9.53707032, aCy: -0.00301530, e0: 0.05415060, eCy: -0.00036762, i0: 2.48446, iCy: 0.00193, L0: 49.94432, LCy: 1222.11379, longPeri0: 92.43194, longPeriCy: -0.41897, longNode0: 113.71504, longNodeCy: -0.28867 },
    moons: {
      mimas: { name: 'Mimas', color: '#b0b0b0', radiusAu: 198.20 / 149597870.7, a: 186000 / 149597870.7, e: 0.020, i: 1.6, periodDays: 0.942422, longNode: 66.2, argPeri: 160.4, meanAnomaly0: 275.3 },
      enceladus: { name: 'Enceladus', color: '#ffffff', radiusAu: 252.10 / 149597870.7, a: 238400 / 149597870.7, e: 0.005, i: 0.0, periodDays: 1.370218, longNode: 0.0, argPeri: 119.5, meanAnomaly0: 57.0 },
      tethys: { name: 'Tethys', color: '#a1a1a1', radiusAu: 531.10 / 149597870.7, a: 295000 / 149597870.7, e: 0.001, i: 1.1, periodDays: 1.887802, longNode: 273.0, argPeri: 335.3, meanAnomaly0: 0.0 },
      dione: { name: 'Dione', color: '#c2c2c2', radiusAu: 561.40 / 149597870.7, a: 377700 / 149597870.7, e: 0.002, i: 0.0, periodDays: 2.736916, longNode: 0.0, argPeri: 116.0, meanAnomaly0: 212.0 },
      rhea: { name: 'Rhea', color: '#d4d4d4', radiusAu: 763.50 / 149597870.7, a: 527200 / 149597870.7, e: 0.001, i: 0.3, periodDays: 4.517503, longNode: 133.7, argPeri: 44.3, meanAnomaly0: 31.5 },
      titan: { name: 'Titan', color: '#e6ad45', radiusAu: 2574.76 / 149597870.7, a: 1221900 / 149597870.7, e: 0.029, i: 0.3, periodDays: 15.945448, longNode: 78.6, argPeri: 78.3, meanAnomaly0: 11.7 },
      iapetus: { name: 'Iapetus', color: '#524e46', radiusAu: 734.30 / 149597870.7, a: 3561700 / 149597870.7, e: 0.028, i: 7.6, periodDays: 79.331002, longNode: 86.5, argPeri: 254.5, meanAnomaly0: 74.8 }
    }
  },
  uranus: {
    name: 'Uranus', color: '#aee5e6', radiusAu: 0.0001693,
    rotation: { ra0: 257.43, raCy: 0.0, dec0: -7.77, decCy: 0.0, w0: 203.81, wDay: -501.1600928 },
    elements: { a0: 19.19126393, aCy: 0.00152025, e0: 0.04716771, eCy: -0.00019150, i0: 0.76986, iCy: -0.00116, L0: 313.23218, LCy: 428.48202, longPeri0: 170.96424, longPeriCy: 0.40805, longNode0: 74.22988, longNodeCy: -0.09420 },
    moons: {
      ariel: { name: 'Ariel', color: '#cfebec', radiusAu: 578.9 / 149597870.7, a: 190929 / 149597870.7, e: 0.001, i: 0.0, periodDays: 2.520379, longNode: 0.0, argPeri: 9.6, meanAnomaly0: 193.5 },
      umbriel: { name: 'Umbriel', color: '#8fa4a6', radiusAu: 584.7 / 149597870.7, a: 265986 / 149597870.7, e: 0.004, i: 0.1, periodDays: 4.144177, longNode: 174.8, argPeri: 183.4, meanAnomaly0: 253.0 },
      titania: { name: 'Titania', color: '#e3f2f2', radiusAu: 788.9 / 149597870.7, a: 436298 / 149597870.7, e: 0.002, i: 0.1, periodDays: 8.705869, longNode: 29.5, argPeri: 184.0, meanAnomaly0: 68.1 },
      oberon: { name: 'Oberon', color: '#b2c2c2', radiusAu: 761.4 / 149597870.7, a: 583511 / 149597870.7, e: 0.002, i: 0.1, periodDays: 13.463237, longNode: 76.8, argPeri: 132.2, meanAnomaly0: 143.6 }
    }
  },
  neptune: {
    name: 'Neptune', color: '#457b9d', radiusAu: 0.0001643,
    rotation: { ra0: 299.35, raCy: 0.0, dec0: 61.68, decCy: 0.0, w0: 48.31, wDay: 536.3128662 },
    elements: { a0: 30.06896348, aCy: -0.00125196, e0: 0.00858587, eCy: 0.00002514, i0: 1.76917, iCy: -0.00001, L0: 304.88003, LCy: 218.45945, longPeri0: 44.97135, longPeriCy: -0.32241, longNode0: 131.72169, longNodeCy: -0.00256 },
    moons: { triton: { name: 'Triton', color: '#d2e4f0', radiusAu: 1352.60 / 149597870.7, a: 354800 / 149597870.7, e: 0.000, i: 157.3, periodDays: 5.876994, longNode: 178.1, argPeri: 0.0, meanAnomaly0: 63.0, retrograde: true } }
  }
};

const AU_KM = 149597870.7;
export const SUN_RADIUS_AU = 696000 / AU_KM;
export const EARTH_RADIUS_AU = 6371 / AU_KM;
const SHADOW_ENLARGEMENT = 1.01;

export class AdvancedAstronomyEngine {
  private static degToRad(deg: number): number { return (deg * Math.PI) / 180; }

  private static vecLength(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  private static vecDot(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  private static angleBetween(a: Vector3D, b: Vector3D): number {
    const cosAngle = this.vecDot(a, b) / (this.vecLength(a) * this.vecLength(b));
    return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  }

  private static normalizeRadians(angle: number): number {
    const twoPi = 2 * Math.PI;
    return ((angle % twoPi) + twoPi) % twoPi;
  }

  public static computeMetrics(planet: PlanetProfile, date: Date) {
    const J2000 = 2451545.0;
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const T = (julianDate - J2000) / 36525;

    const el = planet.elements;
    const a = el.a0 + el.aCy * T;
    const e = el.e0 + el.eCy * T;
    const i = this.degToRad(el.i0 + el.iCy * T);
    const L = this.degToRad(el.L0 + el.LCy * T);
    const longPeri = this.degToRad(el.longPeri0 + el.longPeriCy * T);
    const longNode = this.degToRad(el.longNode0 + el.longNodeCy * T);

    const omega = longPeri - longNode;
    const M = (L - longPeri) % (2 * Math.PI);

    let E = M;
    for (let count = 0; count < 7; count++) {
      E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }

    return { a, e, i, omega, longNode, E };
  }

  public static getPlanetPosition(planet: PlanetProfile, date: Date): Vector3D {
    const { a, e, i, omega, longNode, E } = this.computeMetrics(planet, date);
    const xOrbital = a * (Math.cos(E) - e);
    const yOrbital = a * Math.sqrt(1 - e * e) * Math.sin(E);

    const cosNode = Math.cos(longNode); const sinNode = Math.sin(longNode);
    const cosOmega = Math.cos(omega); const sinOmega = Math.sin(omega);
    const cosInc = Math.cos(i); const sinInc = Math.sin(i);

    return {
      x: xOrbital * (cosNode * cosOmega - sinNode * sinOmega * cosInc) - yOrbital * (cosNode * sinOmega + sinNode * cosOmega * cosInc),
      y: xOrbital * (sinNode * cosOmega + cosNode * sinOmega * cosInc) - yOrbital * (sinNode * sinOmega - cosNode * cosOmega * cosInc),
      z: xOrbital * (sinOmega * sinInc) + yOrbital * (cosOmega * sinInc)
    };
  }

  public static getPlanetEulerRotation(planet: PlanetProfile, date: Date): THREE.Euler {
    const J2000 = 2451545.0;
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const T = (julianDate - J2000) / 36525;
    const D = julianDate - J2000;

    const r = planet.rotation;

    const ra = (r.ra0 + r.raCy * T) * (Math.PI / 180);
    const dec = (r.dec0 + r.decCy * T) * (Math.PI / 180);

    const W = (r.w0 + r.wDay * D) * (Math.PI / 180);

    const poleMatrix = new THREE.Matrix4();

    const poleDirection = new THREE.Vector3(
      Math.cos(dec) * Math.cos(ra),
      Math.sin(dec),
      -Math.cos(dec) * Math.sin(ra)
    ).normalize();

    const upVector = new THREE.Vector3(0, 1, 0);
    const quaternionAxis = new THREE.Quaternion().setFromUnitVectors(upVector, poleDirection);
    poleMatrix.makeRotationFromQuaternion(quaternionAxis);

    const MERIDIAN_CALIBRATION = Math.PI / 2;

    const spinMatrix = new THREE.Matrix4().makeRotationY(W + MERIDIAN_CALIBRATION);
    const finalTransformMatrix = new THREE.Matrix4().multiplyMatrices(poleMatrix, spinMatrix);

    const finalEuler = new THREE.Euler().setFromRotationMatrix(finalTransformMatrix, 'ZXY');

    return finalEuler;
  }

  public static getOrbitPath(planet: PlanetProfile, date: Date, segments: number = 180): Vector3D[] {
    const { a, e, i, omega, longNode } = this.computeMetrics(planet, date);
    const points: Vector3D[] = [];
    const cosNode = Math.cos(longNode); const sinNode = Math.sin(longNode);
    const cosOmega = Math.cos(omega); const sinOmega = Math.sin(omega);
    const cosInc = Math.cos(i); const sinInc = Math.sin(i);

    for (let step = 0; step <= segments; step++) {
      const E_step = (step / segments) * Math.PI * 2;
      const xOrbital = a * (Math.cos(E_step) - e);
      const yOrbital = a * Math.sqrt(1 - e * e) * Math.sin(E_step);
      points.push({
        x: xOrbital * (cosNode * cosOmega - sinNode * sinOmega * cosInc) - yOrbital * (cosNode * sinOmega + sinNode * cosOmega * cosInc),
        y: xOrbital * (sinNode * cosOmega + cosNode * sinOmega * cosInc) - yOrbital * (sinNode * sinOmega - cosNode * cosOmega * cosInc),
        z: xOrbital * (sinOmega * sinInc) + yOrbital * (cosOmega * sinInc)
      });
    }
    return points;
  }

  public static getMoonLocalPosition(moon: MoonProfile, date: Date): Vector3D {
    const J2000 = 2451545.0;
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const daysSinceEpoch = julianDate - J2000;

    const i = this.degToRad(moon.i);
    const longNode = this.degToRad(moon.longNode + (moon.longNodeCyDay ?? 0) * daysSinceEpoch);
    const omega = this.degToRad(moon.argPeri + (moon.argPeriCyDay ?? 0) * daysSinceEpoch);
    const meanAnomaly0 = this.degToRad(moon.meanAnomaly0);

    const direction = moon.retrograde ? -1 : 1;
    const n = (2 * Math.PI) / (moon.anomalisticPeriodDays ?? moon.periodDays);
    const M = this.normalizeRadians(meanAnomaly0 + direction * n * daysSinceEpoch);

    let E = M;
    for (let count = 0; count < 8; count++) {
      E = E - (E - moon.e * Math.sin(E) - M) / (1 - moon.e * Math.cos(E));
    }

    const xOrbital = moon.a * (Math.cos(E) - moon.e);
    const yOrbital = moon.a * Math.sqrt(1 - moon.e * moon.e) * Math.sin(E);

    const cosNode = Math.cos(longNode); const sinNode = Math.sin(longNode);
    const cosOmega = Math.cos(omega); const sinOmega = Math.sin(omega);
    const cosInc = Math.cos(i); const sinInc = Math.sin(i);

    return {
      x: xOrbital * (cosNode * cosOmega - sinNode * sinOmega * cosInc) - yOrbital * (cosNode * sinOmega + sinNode * cosOmega * cosInc),
      y: xOrbital * (sinNode * cosOmega + cosNode * sinOmega * cosInc) - yOrbital * (sinNode * sinOmega - cosNode * cosOmega * cosInc),
      z: xOrbital * (sinOmega * sinInc) + yOrbital * (cosOmega * sinInc)
    };
  }

  public static getMoonLocalPath(moon: MoonProfile, segments: number = 64, date: Date = new Date()): Vector3D[] {
    const J2000 = 2451545.0;
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const daysSinceEpoch = julianDate - J2000;

    const i = this.degToRad(moon.i);
    const longNode = this.degToRad(moon.longNode + (moon.longNodeCyDay ?? 0) * daysSinceEpoch);
    const omega = this.degToRad(moon.argPeri + (moon.argPeriCyDay ?? 0) * daysSinceEpoch);
    const points: Vector3D[] = [];

    const cosNode = Math.cos(longNode); const sinNode = Math.sin(longNode);
    const cosOmega = Math.cos(omega); const sinOmega = Math.sin(omega);
    const cosInc = Math.cos(i); const sinInc = Math.sin(i);

    for (let step = 0; step <= segments; step++) {
      const E = (step / segments) * Math.PI * 2;
      const xOrbital = moon.a * (Math.cos(E) - moon.e);
      const yOrbital = moon.a * Math.sqrt(1 - moon.e * moon.e) * Math.sin(E);

      points.push({
        x: xOrbital * (cosNode * cosOmega - sinNode * sinOmega * cosInc) - yOrbital * (cosNode * sinOmega + sinNode * cosOmega * cosInc),
        y: xOrbital * (sinNode * cosOmega + cosNode * sinOmega * cosInc) - yOrbital * (sinNode * sinOmega - cosNode * cosOmega * cosInc),
        z: xOrbital * (sinOmega * sinInc) + yOrbital * (cosOmega * sinInc)
      });
    }

    return points;
  }

  // ===========================================================================================
  // PRECISE EARTH/SUN/MOON EPHEMERIS
  //
  // Everything above places the Moon via a precessing two-body ellipse, which is good to roughly
  // a degree - fine for "is an eclipse plausible around now" but not for pinning down exact 
  // timing. The functions below replace Earth's and the Moon's positions with the standard 
  // higher-precision series used in real ephemeris software:
  //   - Sun: the VSOP87-derived low-precision solar formula from Jean Meeus, "Astronomical
  //     Algorithms" 2nd ed., ch. 25. Accurate to about 0.01 degrees.
  //   - Moon: the truncated ELP2000-82B series from the same book, ch. 47 (the ~60-term "Table
  //     47.A/47.B" series). Accurate to about 10 arcseconds in longitude/latitude and tens of
  //     km in distance.
  // The periodic-term tables (MOON_LONGITUDE_DISTANCE_TERMS / MOON_LATITUDE_TERMS) are standard,
  // widely-reproduced numerical data cross-checked against the open-source MIT-licensed
  // implementation at github.com/Fabiz/MeeusJs.
  //
  // Combined, Sun+Moon accuracy is comfortably within a few minutes of eclipse timing - it's
  // still geocentric (no topocentric parallax) and doesn't include nutation/nutation-in-obliquity
  // refinements, nor nutation and nutation's aberration on the Moon's longitude, so treat "a few
  // minutes" as the expected order of residual error, not a hard guarantee for every event.
  // ===========================================================================================

  private static julianCentury(date: Date): number {
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    return (julianDate - 2451545.0) / 36525;
  }

  private static horner(T: number, coeffs: number[]): number {
    let result = 0;
    for (let i = coeffs.length - 1; i >= 0; i--) result = result * T + coeffs[i];
    return result;
  }

  /**
   * Sun's apparent geocentric ecliptic longitude and Earth-Sun distance.
   * Meeus ch. 25. Latitude is treated as exactly 0 (true value is under 1.2 arcsec).
   */
  public static getSunEclipticPosition(date: Date): { lonRad: number; distanceAu: number } {
    const T = this.julianCentury(date);
    const p = Math.PI / 180;

    const L0 = this.horner(T, [280.46646, 36000.76983, 0.0003032]) * p;
    const M = this.horner(T, [357.52911, 35999.05029, -0.0001537]) * p;
    const e = this.horner(T, [0.016708634, -0.000042037, -0.0000001267]);

    const C = (this.horner(T, [1.914602, -0.004817, -0.000014]) * Math.sin(M)
      + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
      + 0.000289 * Math.sin(3 * M)) * p;

    const trueLong = L0 + C;
    const trueAnomaly = M + C;
    const Omega = (125.04 - 1934.136 * T) * p;
    // Apparent longitude: true geometric longitude corrected for nutation and aberration.
    const apparentLong = trueLong - 0.00569 * p - 0.00478 * p * Math.sin(Omega);

    const distanceAu = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));

    return { lonRad: this.normalizeRadians(apparentLong), distanceAu };
  }

  /**
   * Sun's geocentric position vector (direction and distance from Earth), in the same
   * ecliptic J2000-ish frame used elsewhere in this file (latitude ~0, so purely planar).
   */
  public static getSunFromEarthPrecise(date: Date): Vector3D {
    const { lonRad, distanceAu } = this.getSunEclipticPosition(date);
    return { x: distanceAu * Math.cos(lonRad), y: distanceAu * Math.sin(lonRad), z: 0 };
  }

  /** Earth's heliocentric position, derived by inverting the precise Sun-from-Earth vector. */
  public static getEarthPositionPrecise(date: Date): Vector3D {
    const s = this.getSunFromEarthPrecise(date);
    return { x: -s.x, y: -s.y, z: -s.z };
  }

  /**
   * Periodic terms for Moon's longitude (suml, in 1e-6 deg) and distance (sumr, in 1e-3 km).
   * Columns: [D, M, M', F, suml, sumr]. Meeus Table 47.A.
   */
  private static readonly MOON_LONGITUDE_DISTANCE_TERMS: number[][] = [
    [0, 0, 1, 0, 6288774, -20905355], [2, 0, -1, 0, 1274027, -3699111],
    [2, 0, 0, 0, 658314, -2955968], [0, 0, 2, 0, 213618, -569925],
    [0, 1, 0, 0, -185116, 48888], [0, 0, 0, 2, -114332, -3149],
    [2, 0, -2, 0, 58793, 246158], [2, -1, -1, 0, 57066, -152138],
    [2, 0, 1, 0, 53322, -170733], [2, -1, 0, 0, 45758, -204586],
    [0, 1, -1, 0, -40923, -129620], [1, 0, 0, 0, -34720, 108743],
    [0, 1, 1, 0, -30383, 104755], [2, 0, 0, -2, 15327, 10321],
    [0, 0, 1, 2, -12528, 0], [0, 0, 1, -2, 10980, 79661],
    [4, 0, -1, 0, 10675, -34782], [0, 0, 3, 0, 10034, -23210],
    [4, 0, -2, 0, 8548, -21636], [2, 1, -1, 0, -7888, 24208],
    [2, 1, 0, 0, -6766, 30824], [1, 0, -1, 0, -5163, -8379],
    [1, 1, 0, 0, 4987, -16675], [2, -1, 1, 0, 4036, -12831],
    [2, 0, 2, 0, 3994, -10445], [4, 0, 0, 0, 3861, -11650],
    [2, 0, -3, 0, 3665, 14403], [0, 1, -2, 0, -2689, -7003],
    [2, 0, -1, 2, -2602, 0], [2, -1, -2, 0, 2390, 10056],
    [1, 0, 1, 0, -2348, 6322], [2, -2, 0, 0, 2236, -9884],
    [0, 1, 2, 0, -2120, 5751], [0, 2, 0, 0, -2069, 0],
    [2, -2, -1, 0, 2048, -4950], [2, 0, 1, -2, -1773, 4130],
    [2, 0, 0, 2, -1595, 0], [4, -1, -1, 0, 1215, -3958],
    [0, 0, 2, 2, -1110, 0], [3, 0, -1, 0, -892, 3258],
    [2, 1, 1, 0, -810, 2616], [4, -1, -2, 0, 759, -1897],
    [0, 2, -1, 0, -713, -2117], [2, 2, -1, 0, -700, 2354],
    [2, 1, -2, 0, 691, 0], [2, -1, 0, -2, 596, 0],
    [4, 0, 1, 0, 549, -1423], [0, 0, 4, 0, 537, -1117],
    [4, -1, 0, 0, 520, -1571], [1, 0, -2, 0, -487, -1739],
    [2, 1, 0, -2, -399, 0], [0, 0, 2, -2, -381, -4421],
    [1, 1, 1, 0, 351, 0], [3, 0, -2, 0, -340, 0],
    [4, 0, -3, 0, 330, 0], [2, -1, 2, 0, 327, 0],
    [0, 2, 1, 0, -323, 1165], [1, 1, -1, 0, 299, 0],
    [2, 0, 3, 0, 294, 0], [2, 0, -1, -2, 0, 8752]
  ];

  /**
   * Periodic terms for Moon's ecliptic latitude (sumb, in 1e-6 deg).
   * Columns: [D, M, M', F, sumb]. Meeus Table 47.B.
   */
  private static readonly MOON_LATITUDE_TERMS: number[][] = [
    [0, 0, 0, 1, 5128122], [0, 0, 1, 1, 280602], [0, 0, 1, -1, 277693], [2, 0, 0, -1, 173237],
    [2, 0, -1, 1, 55413], [2, 0, -1, -1, 46271], [2, 0, 0, 1, 32573], [0, 0, 2, 1, 17198],
    [2, 0, 1, -1, 9266], [0, 0, 2, -1, 8822], [2, -1, 0, -1, 8216], [2, 0, -2, -1, 4324],
    [2, 0, 1, 1, 4200], [2, 1, 0, -1, -3359], [2, -1, -1, 1, 2463], [2, -1, 0, 1, 2211],
    [2, -1, -1, -1, 2065], [0, 1, -1, -1, -1870], [4, 0, -1, -1, 1828], [0, 1, 0, 1, -1794],
    [0, 0, 0, 3, -1749], [0, 1, -1, 1, -1565], [1, 0, 0, 1, -1491], [0, 1, 1, 1, -1475],
    [0, 1, 1, -1, -1410], [0, 1, 0, -1, -1344], [1, 0, 0, -1, -1335], [0, 0, 3, 1, 1107],
    [4, 0, 0, -1, 1021], [4, 0, -1, 1, 833], [0, 0, 1, -3, 777], [4, 0, -2, 1, 671],
    [2, 0, 0, -3, 607], [2, 0, 2, -1, 596], [2, -1, 1, -1, 491], [2, 0, -2, 1, -451],
    [0, 0, 3, -1, 439], [2, 0, 2, 1, 422], [2, 0, -3, -1, 421], [2, 1, -1, 1, -366],
    [2, 1, 0, 1, -351], [4, 0, 0, 1, 331], [2, -1, 1, 1, 315], [2, -2, 0, -1, 302],
    [0, 0, 1, 3, -283], [2, 1, 1, -1, -229], [1, 1, 0, -1, 223], [1, 1, 0, 1, 223],
    [0, 1, -2, -1, -220], [2, 1, -1, -1, -220], [1, 0, 1, 1, -185], [2, -1, -2, -1, 181],
    [0, 1, 2, 1, -177], [4, 0, -2, -1, 176], [4, -1, -1, -1, 166], [1, 0, 1, -1, -164],
    [4, 0, 1, -1, 132], [1, 0, -1, -1, -119], [4, -1, 0, -1, 115], [2, -2, 0, 1, 107]
  ];

  /**
   * Moon's geocentric ecliptic longitude, latitude, and distance via the truncated
   * ELP2000-82B series (Meeus ch. 47). Distance is in AU for consistency with the rest
   * of this file; the underlying series computes it in km.
   */
  public static getEarthMoonEclipticPosition(date: Date): { lonRad: number; latRad: number; distanceAu: number } {
    const T = this.julianCentury(date);
    const p = Math.PI / 180;
    const AU_KM_LOCAL = 149597870.7;

    const Lp = this.normalizeRadians(this.horner(T, [218.3164477, 481267.88123421, -0.0015786, 1 / 538841, -1 / 65194000]) * p);
    const D = this.normalizeRadians(this.horner(T, [297.8501921, 445267.1114034, -0.0018819, 1 / 545868, -1 / 113065000]) * p);
    const M = this.normalizeRadians(this.horner(T, [357.5291092, 35999.0502909, -0.0001535, 1 / 24490000]) * p);
    const Mp = this.normalizeRadians(this.horner(T, [134.9633964, 477198.8675055, 0.0087414, 1 / 69699, -1 / 14712000]) * p);
    const F = this.normalizeRadians(this.horner(T, [93.272095, 483202.0175233, -0.0036539, -1 / 3526000, 1 / 863310000]) * p);

    // Three extra correction arguments accounting for Venus, Jupiter, and Earth's flattening.
    const A1 = (119.75 + 131.849 * T) * p;
    const A2 = (53.09 + 479264.29 * T) * p;
    const A3 = (313.45 + 481266.484 * T) * p;
    // Correction factor for Earth orbital eccentricity, applied whenever a term uses M or 2M.
    const E = this.horner(T, [1, -0.002516, -0.0000074]);
    const E2 = E * E;

    let sumL = 3958 * Math.sin(A1) + 1962 * Math.sin(Lp - F) + 318 * Math.sin(A2);
    let sumR = 0;
    let sumB = -2235 * Math.sin(Lp) + 382 * Math.sin(A3) + 175 * Math.sin(A1 - F)
      + 175 * Math.sin(A1 + F) + 127 * Math.sin(Lp - Mp) - 115 * Math.sin(Lp + Mp);

    for (const [cD, cM, cMp, cF, coefL, coefR] of this.MOON_LONGITUDE_DISTANCE_TERMS) {
      const arg = D * cD + M * cM + Mp * cMp + F * cF;
      const eccFactor = cM === 0 ? 1 : (Math.abs(cM) === 1 ? E : E2);
      sumL += coefL * Math.sin(arg) * eccFactor;
      sumR += coefR * Math.cos(arg) * eccFactor;
    }

    for (const [cD, cM, cMp, cF, coefB] of this.MOON_LATITUDE_TERMS) {
      const arg = D * cD + M * cM + Mp * cMp + F * cF;
      const eccFactor = cM === 0 ? 1 : (Math.abs(cM) === 1 ? E : E2);
      sumB += coefB * Math.sin(arg) * eccFactor;
    }

    const lonRad = this.normalizeRadians(Lp + sumL * 1e-6 * p);
    const latRad = sumB * 1e-6 * p;
    const distanceKm = 385000.56 + sumR * 1e-3;

    return { lonRad, latRad, distanceAu: distanceKm / AU_KM_LOCAL };
  }

  /** Moon's precise geocentric position vector, same ecliptic frame as the rest of this file. */
  public static getEarthMoonPositionPrecise(date: Date): Vector3D {
    const { lonRad, latRad, distanceAu } = this.getEarthMoonEclipticPosition(date);
    return {
      x: distanceAu * Math.cos(latRad) * Math.cos(lonRad),
      y: distanceAu * Math.cos(latRad) * Math.sin(lonRad),
      z: distanceAu * Math.sin(latRad)
    };
  }

  /**
   * Samples Earth's precise heliocentric path over one sidereal year starting at `date`.
   * Unlike a fixed Kepler ellipse, this is generated by evaluating the true ephemeris at
   * each sample point, so it reflects Earth's actual (very slightly non-repeating) orbit.
   */
  public static getEarthPathPrecise(segments: number = 360, date: Date = new Date()): Vector3D[] {
    const SIDEREAL_YEAR_DAYS = 365.256363;
    const points: Vector3D[] = [];
    for (let step = 0; step <= segments; step++) {
      const t = new Date(date.getTime() + (step / segments) * SIDEREAL_YEAR_DAYS * 86400000);
      points.push(this.getEarthPositionPrecise(t));
    }
    return points;
  }

  /**
   * Samples the Moon's precise geocentric path over one sidereal month starting at `date`.
   * This is the Moon's actual current osculating path, including the perturbation wobble -
   * there's no simple closed-form ellipse anymore, so it's drawn by direct sampling.
   */
  public static getEarthMoonPathPrecise(segments: number = 180, date: Date = new Date()): Vector3D[] {
    const SIDEREAL_MONTH_DAYS = 27.321661;
    const points: Vector3D[] = [];
    for (let step = 0; step <= segments; step++) {
      const t = new Date(date.getTime() + (step / segments) * SIDEREAL_MONTH_DAYS * 86400000);
      points.push(this.getEarthMoonPositionPrecise(t));
    }
    return points;
  }
}
