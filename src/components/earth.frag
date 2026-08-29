varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uLightsTexture;

uniform vec3 uSunPosition;
uniform vec3 uMoonPosition;   // Added: Moon direction/position
uniform vec3 uCameraPosition; // Added: Needed for realistic specular reflection
uniform float uNightIntensity;
uniform float uMoonLightingFactor; // Added: Controls moon brightness
uniform float
    uMoonSpecularIntensity; // Added: Controls ocean shininess under the moon

void main() {
  // 1. Texture lookups
  vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
  vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
  float lightFactor = texture2D(uLightsTexture, vUv).r;

  // 2. Vector math
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
  vec3 moonDirection = normalize(uMoonPosition - vWorldPosition);
  vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);

  // 3. Day / Night transition (Terminator)
  float sunlight = dot(normal, sunDirection);
  float dayFactor = smoothstep(-0.12, 0.20, sunlight);
  float nightFactor = 1.0 - dayFactor;

  // 4. City Lights (Emission)
  // Mask the pre-baked NASA texture using your pure black-and-white mask.
  // This completely eliminates gray background fog on unlit areas.
  vec3 isolatedCities = nightColor * lightFactor * uNightIntensity;

  // 5. Moonlight Terrain (Diffuse)
  float moonlight = dot(normal, moonDirection);
  float moonFactor = smoothstep(0.0, 0.25, moonlight) * nightFactor;

  // Reuse day texture as a base for moonlit land/water, heavily
  // desaturating/darkening it
  vec3 moonTerrain = dayColor * 0.12 * uMoonLightingFactor * moonFactor;

  // 6. Moon Specular Glare (Oceans Only)
  // We assume ocean areas have high blue channel values and low light factor
  float oceanMask =
      clamp(dayColor.b - dayColor.r, 0.0, 1.0) * (1.0 - lightFactor);

  // Phong reflection vector for the moon
  vec3 reflectDir = reflect(-moonDirection, normal);
  float specAngle = max(dot(reflectDir, viewDirection), 0.0);

  // High exponent (64.0) gives a sharp, realistic silver reflection on the
  // water
  float specular =
      pow(specAngle, 64.0) * oceanMask * uMoonSpecularIntensity * moonFactor;
  vec3 moonSpecularColor = vec3(0.9, 0.9, 1.0) * specular; // Silver/white glare

  // 7. Combine dark side features
  // Unlit regions are composed of city emissions + moon diffuse terrain + moon
  // ocean glare
  vec3 darkSideColor = isolatedCities + moonTerrain + moonSpecularColor;

  // 8. Final Blending
  vec3 finalColor = (dayColor * dayFactor) + (darkSideColor * nightFactor);

  gl_FragColor = vec4(finalColor, 1.0);
}
