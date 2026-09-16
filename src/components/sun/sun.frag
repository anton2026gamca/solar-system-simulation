varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform vec3 uCameraPosition;

void main() {
  vec3 normal = normalize(-vWorldNormal);
  vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
  float viewDist = distance(uCameraPosition, vWorldPosition);

  float dotVN = max(dot(viewDir, normal), 0.0);

  float sunDisk = pow(dotVN, 32.0);

  float coronaThickness = 0.0025;
  float vacuumFade = coronaThickness / (1.0 - dotVN);
  vacuumFade = clamp(vacuumFade, 0.0, 1.0);

  float finalAlpha = sunDisk + pow(vacuumFade, 2.5);

  vec3 coreWhite = vec3(1.0, 1.0, 1.0);
  vec3 outerTint = vec3(1.0, 0.96, 0.88);

  vec3 finalColor = mix(outerTint, coreWhite, sunDisk);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
