varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

uniform sampler2D uCloudTexture;
uniform vec3 uSunPosition;

void main() {
  float cloudValue = texture2D(uCloudTexture, vUv).r;
  cloudValue = smoothstep(0.05, 0.55, cloudValue);

  vec3 normal = normalize(vWorldNormal);
  vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
  float sunlight = max(dot(normal, sunDirection), 0.0);

  vec3 dayCloudColor = vec3(1.0, 1.0, 1.0);
  vec3 nightCloudColor = vec3(0.05, 0.06, 0.08);

  vec3 cloudColor = mix(nightCloudColor, dayCloudColor, sunlight);

  gl_FragColor = vec4(cloudColor, cloudValue);
}
