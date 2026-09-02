varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform vec3 uSunPosition;
uniform vec3 uCameraPosition;
uniform float uIntensity;

void main() {
  vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
  vec3 sunDir = normalize(uSunPosition - vWorldPosition);

  vec3 transparencyNormal = normalize(-vWorldNormal);

  vec3 lightingNormal = normalize(vWorldNormal);

  float dotVN = max(dot(viewDir, transparencyNormal), 0.0);
  float atmosphereGlow = pow(1.0 - dotVN, 3.0);

  float cosTheta = dot(viewDir, sunDir);

  float rayleighPhase = 0.75 * (1.0 + cosTheta * cosTheta);

  float miePhase = pow(max(0.0, cosTheta), 8.0) * 0.5;

  float sunScattering = smoothstep(-0.2, 0.4, dot(lightingNormal, sunDir));
  float totalScattering = sunScattering * (rayleighPhase + miePhase);

  float finalAlpha = atmosphereGlow * totalScattering * uIntensity;

  vec3 skyColor = vec3(0.18, 0.46, 1.0);

  vec3 finalColor = mix(skyColor, vec3(0.85, 0.92, 1.0), miePhase * 0.4);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
