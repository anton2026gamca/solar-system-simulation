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
  T: number;
  longNode: number;
  longPeri: number;
  meanLong0: number;
}

export interface PlanetProfile {
  name: string;
  color: string;
  radiusAu: number;
  elements: OrbitalElements;
  moons?: Record<string, MoonProfile>;
}

export const REALISTIC_PLANETS: Record<string, PlanetProfile> = {
  mercury: {
    name: 'Mercury', color: '#9e9e9e', radiusAu: 0.0000163,
    elements: {
      a0: 0.38709893, aCy: 0.00000066, e0: 0.20563069, eCy: 0.00002040,
      i0: 7.00487, iCy: -0.00594, L0: 252.25084, LCy: 149472.67411,
      longPeri0: 77.45645, longPeriCy: 0.15901, longNode0: 48.33167, longNodeCy: -0.12531
    }
  },
  venus: {
    name: 'Venus', color: '#e3bb76', radiusAu: 0.0000404,
    elements: {
      a0: 0.72333199, aCy: 0.00000092, e0: 0.00677323, eCy: -0.00004776,
      i0: 3.39471, iCy: -0.00078, L0: 181.97973, LCy: 58517.81538,
      longPeri0: 131.53298, longPeriCy: 0.00213, longNode0: 76.68069, longNodeCy: -0.27769
    }
  },
  earth: {
    name: 'Earth', color: '#2f82c4', radiusAu: 0.0000426,
    elements: {
      a0: 1.00000011, aCy: -0.00000005, e0: 0.01671022, eCy: -0.00003804,
      i0: 0.00005, iCy: -0.01300, L0: 100.46435, LCy: 36000.76983,
      longPeri0: 102.94719, longPeriCy: 0.32225, longNode0: -11.26064, longNodeCy: -0.41322
    },
    moons: {
      moon: {
        name: 'The Moon', color: '#b0bec5', radiusAu: 0.0000116,
        a: 0.00257, e: 0.0549, i: 5.145, T: 27.32166,
        longNode: 125.08, longPeri: 83.35, meanLong0: 135.27
      }
    }
  },
  mars: {
    name: 'Mars', color: '#e06138', radiusAu: 0.0000227,
    elements: {
      a0: 1.52366231, aCy: -0.00000497, e0: 0.09341233, eCy: 0.00011902,
      i0: 1.85061, iCy: -0.00724, L0: 355.45332, LCy: 19140.30268,
      longPeri0: 336.04084, longPeriCy: 0.44388, longNode0: 49.57854, longNodeCy: -0.29411
    },
    moons: {
      phobos: { name: 'Phobos', color: '#8d6e63', radiusAu: 0.00000007, a: 0.000062, e: 0.0151, i: 1.093, T: 0.31891, longNode: 49.57, longPeri: 336.04, meanLong0: 10.0 },
      deimos: { name: 'Deimos', color: '#bcaaa4', radiusAu: 0.00000004, a: 0.000156, e: 0.0002, i: 1.793, T: 1.26244, longNode: 49.57, longPeri: 336.04, meanLong0: 250.0 }
    }
  },
  jupiter: {
    name: 'Jupiter', color: '#d4a373', radiusAu: 0.0004673,
    elements: {
      a0: 5.20336301, aCy: 0.00060737, e0: 0.04839266, eCy: -0.00012880,
      i0: 1.30530, iCy: -0.00415, L0: 34.40438, LCy: 3034.74612,
      longPeri0: 14.75385, longPeriCy: 0.19152, longNode0: 100.55615, longNodeCy: 0.20426
    },
    moons: {
      io: { name: 'Io', color: '#e6c229', radiusAu: 0.0000121, a: 0.002819, e: 0.0041, i: 0.050, T: 1.76913, longNode: 100.55, longPeri: 14.75, meanLong0: 20.0 },
      europa: { name: 'Europa', color: '#b8b8b8', radiusAu: 0.0000104, a: 0.004486, e: 0.0090, i: 0.471, T: 3.55118, longNode: 100.55, longPeri: 14.75, meanLong0: 90.0 },
      ganymede: { name: 'Ganymede', color: '#a3937b', radiusAu: 0.0000176, a: 0.007155, e: 0.0013, i: 0.204, T: 7.15455, longNode: 100.55, longPeri: 14.75, meanLong0: 180.0 },
      callisto: { name: 'Callisto', color: '#615c53', radiusAu: 0.0000161, a: 0.012585, e: 0.0074, i: 0.281, T: 16.6890, longNode: 100.55, longPeri: 14.75, meanLong0: 270.0 },
      himalia: { name: 'Himalia', color: '#a19c92', radiusAu: 0.00000057, a: 0.076632, e: 0.1623, i: 27.496, T: 250.56, longNode: 45.71, longPeri: 324.21, meanLong0: 312.4 },
      elara: { name: 'Elara', color: '#8c8880', radiusAu: 0.00000027, a: 0.078231, e: 0.2174, i: 26.621, T: 259.64, longNode: 108.31, longPeri: 143.52, meanLong0: 45.1 },
      lysithea: { name: 'Lysithea', color: '#7a7771', radiusAu: 0.00000013, a: 0.078352, e: 0.1124, i: 28.302, T: 259.20, longNode: 121.45, longPeri: 22.84, meanLong0: 187.9 },
      ananke: { name: 'Ananke', color: '#807b73', radiusAu: 0.00000009, a: 0.142245, e: 0.2435, i: 148.88, T: -629.77, longNode: 312.54, longPeri: 87.21, meanLong0: 22.4 },
      carme: { name: 'Carme', color: '#6e6a61', radiusAu: 0.00000015, a: 0.156450, e: 0.2533, i: 164.91, T: -734.17, longNode: 109.42, longPeri: 290.11, meanLong0: 145.8 },
      pasiphae: { name: 'Pasiphae', color: '#5c5952', radiusAu: 0.00000020, a: 0.157980, e: 0.4090, i: 151.43, T: -743.63, longNode: 24.11, longPeri: 175.42, meanLong0: 98.2 },
      sinope: { name: 'Sinope', color: '#4d4b45', radiusAu: 0.00000012, a: 0.159980, e: 0.2495, i: 158.11, T: -758.90, longNode: 133.45, longPeri: 302.21, meanLong0: 254.1 }
    }
  },
  saturn: {
    name: 'Saturn', color: '#f4e2bb', radiusAu: 0.0003893,
    elements: {
      a0: 9.53707032, aCy: -0.00301530, e0: 0.05415060, eCy: -0.00036762,
      i0: 2.48446, iCy: 0.00193, L0: 49.94432, LCy: 1222.11379,
      longPeri0: 92.43194, longPeriCy: -0.41897, longNode0: 113.71504, longNodeCy: -0.28867
    },
    moons: {
      mimas: { name: 'Mimas', color: '#b0b0b0', radiusAu: 0.0000013, a: 0.001240, e: 0.0196, i: 1.574, T: 0.94242, longNode: 113.71, longPeri: 92.43, meanLong0: 15.0 },
      enceladus: { name: 'Enceladus', color: '#ffffff', radiusAu: 0.0000017, a: 0.001590, e: 0.0047, i: 0.019, T: 1.37021, longNode: 113.71, longPeri: 92.43, meanLong0: 85.0 },
      tethys: { name: 'Tethys', color: '#a1a1a1', radiusAu: 0.0000035, a: 0.001970, e: 0.0001, i: 1.091, T: 1.88780, longNode: 113.71, longPeri: 92.43, meanLong0: 40.0 },
      dione: { name: 'Dione', color: '#c2c2c2', radiusAu: 0.0000037, a: 0.002520, e: 0.0022, i: 0.019, T: 2.73691, longNode: 113.71, longPeri: 92.43, meanLong0: 120.0 },
      rhea: { name: 'Rhea', color: '#d4d4d4', radiusAu: 0.0000051, a: 0.003520, e: 0.0012, i: 0.345, T: 4.51750, longNode: 113.71, longPeri: 92.43, meanLong0: 210.0 },
      titan: { name: 'Titan', color: '#e6ad45', radiusAu: 0.0000172, a: 0.008170, e: 0.0288, i: 0.334, T: 15.9454, longNode: 113.71, longPeri: 92.43, meanLong0: 300.0 },
      iapetus: { name: 'Iapetus', color: '#524e46', radiusAu: 0.0000049, a: 0.023800, e: 0.0286, i: 7.570, T: 79.3302, longNode: 113.71, longPeri: 92.43, meanLong0: 160.0 }
    }
  },
  uranus: {
    name: 'Uranus', color: '#aee5e6', radiusAu: 0.0001693,
    elements: {
      a0: 19.19126393, aCy: 0.00152025, e0: 0.04716771, eCy: -0.00019150,
      i0: 0.76986, iCy: -0.00116, L0: 313.23218, LCy: 428.48202,
      longPeri0: 170.96424, longPeriCy: 0.40805, longNode0: 74.22988, longNodeCy: -0.09420
    },
    moons: {
      ariel: { name: 'Ariel', color: '#cfebec', radiusAu: 0.0000039, a: 0.001280, e: 0.0012, i: 0.260, T: 2.52038, longNode: 74.22, longPeri: 170.96, meanLong0: 45.0 },
      umbriel: { name: 'Umbriel', color: '#8fa4a6', radiusAu: 0.0000039, a: 0.001780, e: 0.0039, i: 0.200, T: 4.14418, longNode: 74.22, longPeri: 170.96, meanLong0: 135.0 },
      titania: { name: 'Titania', color: '#e3f2f2', radiusAu: 0.0000053, a: 0.002910, e: 0.0011, i: 0.340, T: 8.70588, longNode: 74.22, longPeri: 170.96, meanLong0: 220.0 },
      oberon: { name: 'Oberon', color: '#b2c2c2', radiusAu: 0.0000051, a: 0.003890, e: 0.0014, i: 0.050, T: 13.4632, longNode: 74.22, longPeri: 170.96, meanLong0: 315.0 }
    }
  },
  neptune: {
    name: 'Neptune', color: '#457b9d', radiusAu: 0.0001643,
    elements: {
      a0: 30.06896348, aCy: -0.00125196, e0: 0.00858587, eCy: 0.00002514,
      i0: 1.76917, iCy: -0.00001, L0: 304.88003, LCy: 218.45945,
      longPeri0: 44.97135, longPeriCy: -0.32241, longNode0: 131.72169, longNodeCy: -0.00256
    },
    moons: {
      triton: { name: 'Triton', color: '#d2e4f0', radiusAu: 0.0000091, a: 0.002369, e: 0.0000, i: 156.885, T: -5.87685, longNode: 131.72, longPeri: 44.97, meanLong0: 90.0 }
    }
  }
};

export class AdvancedAstronomyEngine {
  private static degToRad(deg: number): number { return (deg * Math.PI) / 180; }

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
    const longNode = this.degToRad(moon.longNode);
    const longPeri = this.degToRad(moon.longPeri);
    const meanLong0 = this.degToRad(moon.meanLong0);

    const omega = longPeri - longNode;

    const n = (2 * Math.PI) / moon.T;
    const M = (meanLong0 - longPeri + n * daysSinceEpoch) % (2 * Math.PI);

    let E = M;
    for (let count = 0; count < 5; count++) {
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

  public static getMoonLocalPath(moon: MoonProfile, segments: number = 64): Vector3D[] {
    const i = this.degToRad(moon.i);
    const longNode = this.degToRad(moon.longNode);
    const longPeri = this.degToRad(moon.longPeri);
    const omega = longPeri - longNode;
    const points: Vector3D[] = [];
    const cosNode = Math.cos(longNode); const sinNode = Math.sin(longNode);
    const cosOmega = Math.cos(omega); const sinOmega = Math.sin(omega);
    const cosInc = Math.cos(i); const sinInc = Math.sin(i);

    for (let step = 0; step <= segments; step++) {
      const E_step = (step / segments) * Math.PI * 2;
      const xOrbital = moon.a * (Math.cos(E_step) - moon.e);
      const yOrbital = moon.a * Math.sqrt(1 - moon.e * moon.e) * Math.sin(E_step);
      points.push({
        x: xOrbital * (cosNode * cosOmega - sinNode * sinOmega * cosInc) - yOrbital * (cosNode * sinOmega + sinNode * cosOmega * cosInc),
        y: xOrbital * (sinNode * cosOmega + cosNode * sinOmega * cosInc) - yOrbital * (sinNode * sinOmega - cosNode * cosOmega * cosInc),
        z: xOrbital * (sinOmega * sinInc) + yOrbital * (cosOmega * sinInc)
      });
    }
    return points;
  }
}
