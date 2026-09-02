varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uLightsTexture;
uniform sampler2D uSpecularTexture;
uniform sampler2D uBumpTexture;

uniform vec3 uSunPosition;
uniform vec3 uMoonPosition;
uniform vec3 uCameraPosition;
uniform float uNightLightsIntensity;
uniform float uMoonLightingFactor;
uniform float uMoonSpecularIntensity;

float getHeight(vec2 uv) { return texture2D(uBumpTexture, uv).r; }

void main() {
  vec2 texelSize = vec2(1.0 / 21600.0, 1.0 / 10800.0);
  float bumpScale = 5.0;

  float hCurrent = getHeight(vUv);
  float hU = getHeight(vUv + vec2(texelSize.x, 0.0));
  float hV = getHeight(vUv + vec2(0.0, texelSize.y));

  float dHdU = (hU - hCurrent) * bumpScale;
  float dHdV = (hV - hCurrent) * bumpScale;

  vec3 baseNormal = normalize(vWorldNormal);

  vec3 tangent = normalize(cross(baseNormal, vec3(0.0, 1.0, 0.0)));
  if (length(tangent) < 0.1)
    tangent = normalize(cross(baseNormal, vec3(0.0, 0.0, 1.0)));
  vec3 bitangent = cross(baseNormal, tangent);

  vec3 perturbedNormal = baseNormal - (tangent * dHdU) - (bitangent * dHdV);
  vec3 normal = normalize(perturbedNormal);

  vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
  vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
  float lightFactor = texture2D(uLightsTexture, vUv).r;

  vec3 specularFactor = texture2D(uSpecularTexture, vUv).rgb;
  float maxSpecularChannel =
      max(specularFactor.r, max(specularFactor.g, specularFactor.b));
  float oceanMask = 1.0 - step(0.5, maxSpecularChannel);

  vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
  vec3 moonDirection = normalize(uMoonPosition - vWorldPosition);
  vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);

  float sunlightTransition = dot(baseNormal, sunDirection);
  float dayFactor = smoothstep(-0.12, 0.20, sunlightTransition);
  float nightFactor = 1.0 - dayFactor;

  vec3 oceanBoost =
      mix(vec3(1), vec3(1, 1, 2), oceanMask * (1.0 - step(0.08, dayColor.b)));

  float diffuseSun = max(dot(normal, sunDirection), 0.2);
  vec3 shadedDayColor = dayColor * diffuseSun * oceanBoost;

  vec3 isolatedCities = nightColor * lightFactor * uNightLightsIntensity;

  float moonlight = dot(normal, moonDirection);
  float moonFactor = smoothstep(0.0, 0.25, moonlight) * nightFactor;

  vec3 moonTerrain = dayColor * 0.12 * uMoonLightingFactor * moonFactor;

  vec3 reflectDir = reflect(-moonDirection, normal);
  float specAngle = max(dot(reflectDir, viewDirection), 0.0);

  float specular = pow(specAngle, 64.0) * oceanMask * uMoonSpecularIntensity *
                   moonFactor * 0.5;
  vec3 moonSpecularColor = vec3(0.9, 0.9, 1.0) * specular;

  vec3 darkSideColor = isolatedCities + moonTerrain + moonSpecularColor;

  vec3 finalColor =
      (shadedDayColor * dayFactor) + (darkSideColor * nightFactor);

  gl_FragColor = vec4(finalColor, 1.0);
}
