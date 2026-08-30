varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform vec3 uSunPosition;
uniform float uIntensity;

void main() {
  vec3 normal = normalize(vWorldNormal);

  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

  float rim = 1.0 - max(dot(viewDirection, normal), 0.0);
  rim = pow(rim, 3.5);

  vec3 sunDirection = normalize(uSunPosition - vWorldPosition);

  float sunAmount = max(dot(normal, sunDirection), 0.0);

  float intensity = rim * (0.15 + sunAmount * 0.85) * uIntensity;

  vec3 atmosphereColor = vec3(0.16, 0.42, 1.0);

  gl_FragColor = vec4(atmosphereColor, intensity);
}
